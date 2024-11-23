import { DropzoneOptions, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import {
  getThumbnailUploadUrl,
  getVideoUploadUrl,
  uploadPresignedURLFile,
} from "@/auth/api/upload";
import { UploadDropZoneContainer } from "@/components/UploadDropZoneContainer";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { grey } from "@mui/material/colors";
import { FieldApi, useForm } from "@tanstack/react-form";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

import TextField from "@/components/TextField";
import { RadioDescribedInput } from "@/components/RadioDescribedInput";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { UploadInput } from "@/components/UploadInput";
import { Currency, PaymentModel, Visibility } from "@/types/upload";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

import { getSignUrlArgs } from "@/utils/uploads";
import { createMedia } from "@/auth/api/media";

export const UploadSection: React.FC<{
  icon?: React.ReactElement;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  htmlFor?: string;
}> = ({ actions, children, icon, title, htmlFor }) => {
  return (
    <Box marginTop={2}>
      <Box paddingBottom=".4rem" border="none" display="flex" justifyContent="space-between">
        <FormLabel
          sx={{ display: "flex", alignItems: "center", paddingLeft: `${icon ? 0 : 1.54}rem` }}
          htmlFor={htmlFor}
        >
          {icon && (
            <Typography component="span" fontSize={16} marginRight={1.5}>
              {icon}
            </Typography>
          )}
          <Typography component="span" variant="subtitle1" textTransform="capitalize">
            {title}
          </Typography>
        </FormLabel>
        <Box>{actions}</Box>
      </Box>
      <Card>
        <FormControl
          sx={{
            display: "flex",
            padding: 2,
          }}
        >
          {children}
        </FormControl>
      </Card>
    </Box>
  );
};

const dateTimeSchema = z.custom<DateTime | null>((val) => {
  return DateTime.isDateTime(val);
}, "Invalid DateTime object");

const mediaSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  video: z.instanceof(File),
  thumbnail: z.union([z.instanceof(File), z.null()]),
  visibility: z.nativeEnum(Visibility),
  paymentModel: z.nativeEnum(PaymentModel),
  scheduledDate: dateTimeSchema,
  currency: z.nativeEnum(Currency),
  price: z.string().optional(),
});
type MediaSchema = z.infer<typeof mediaSchema>;

export const MediaUpload = () => {
  const form = useForm({
    validatorAdapter: zodValidator(),
    validators: {
      onChange: mediaSchema,
    },
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
      visibility: Visibility.PUBLIC,
      paymentModel: PaymentModel.FREE,
      currency: Currency.USD,
      price: "",
    } as MediaSchema,
    onSubmit: async ({ value }) => {
      if (!value.thumbnail) return;
      if (!value.video) return;

      const { video, thumbnail, price, scheduledDate, ...rest } = value;
      const videoSignUrlArgs = await getSignUrlArgs(video);

      const {
        data: { key: videoKey, url: videoUploadUrl },
      } = await getVideoUploadUrl(videoSignUrlArgs);

      const thumbnailSignUrlArgs = await getSignUrlArgs(thumbnail);

      const {
        data: { key: thumbnailKey, url: thumbnailURL },
      } = await getThumbnailUploadUrl(thumbnailSignUrlArgs);

      await createMedia({
        ...rest,
        videoUrl: videoKey,
        thumbnailUrl: thumbnailKey,
        price: +price!,
        scheduledDate: scheduledDate?.toJSDate(),
      });

      await uploadPresignedURLFile(videoUploadUrl, video, videoSignUrlArgs);
      await uploadPresignedURLFile(thumbnailURL, thumbnail, thumbnailSignUrlArgs);
    },
  });

  const videoField = form.useField({
    name: "video",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type GenericField = FieldApi<any, any>;

  const handleDropZone = (fieldApi: GenericField): DropzoneOptions["onDrop"] => {
    return ([file], [rejection]) => {
      fieldApi.handleChange(rejection?.file ?? file);
      fieldApi.setErrorMap({
        onChange: rejection?.errors?.at(0)?.message,
      });
    };
  };

  const videoDropZoneProps = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDrop: handleDropZone(videoField as unknown as GenericField),
    accept: {
      "video/mp4": [".mp4"],
      "video/mpeg": [".mpeg"],
      "video/webm": [".webm"],
    },
    maxFiles: 1,
    maxSize: 16 * 1024 ** 3, // 16 GiB
  });

  const thumbnailField = form.useField({
    name: "thumbnail",
  });

  const thumbnailDropZoneProps = useDropzone({
    onDrop: handleDropZone(thumbnailField as unknown as GenericField),
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 ** 2, // 5 MiB
  });

  const visibilityField = form.useField({
    name: "visibility",
  });
  const isScheduledDateVisible = visibilityField.state.value === Visibility.SCHEDULED;

  const paymentModelField = form.useField({
    name: "paymentModel",
  });
  const isPriceVisible = paymentModelField.state.value !== PaymentModel.FREE;

  return (
    <Container
      maxWidth="md"
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <UploadDropZoneContainer {...videoDropZoneProps}>
        <UploadSection
          title="Upload file"
          htmlFor={videoField.name}
          icon={<CloudUploadIcon />}
          actions={
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="contained"
              size="small"
              startIcon={<RefreshIcon />}
            >
              Reset
            </Button>
          }
        >
          <UploadInput
            {...videoField}
            helperText="For video content, use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps)."
          />

          <form.Field
            name="title"
            children={(props) => (
              <TextField
                inputProps={{
                  style: {
                    marginTop: "1rem",
                  },
                }}
                {...props}
                handleClick={(e) => e.stopPropagation()}
              />
            )}
          />
        </UploadSection>
      </UploadDropZoneContainer>

      <UploadSection htmlFor="description" title="description" icon={<DescriptionIcon />}>
        <form.Field
          name="description"
          children={(props) => (
            <TextField {...props} minRows={2} maxRows={15} multiline omitLabel />
          )}
        />
      </UploadSection>

      <UploadDropZoneContainer {...thumbnailDropZoneProps}>
        <UploadSection htmlFor={videoField.name} title="thumbnail" icon={<ImageIcon />}>
          <Box display="flex" minHeight={256} gap={2}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flex={2}
              fontSize={40}
              sx={{ background: grey["200"] }}
            >
              {thumbnailField.state.value ? (
                <img
                  src={
                    thumbnailField.state.value && URL.createObjectURL(thumbnailField.state.value)
                  }
                  alt="Thumbnail Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <ImageOutlinedIcon />
              )}
            </Box>
            <Box flex={3}>
              <UploadInput
                {...thumbnailField}
                helperText="Use JPEG, PNG, or WEBP formats, with a maximum size of 5MB."
              />
            </Box>
          </Box>
        </UploadSection>
      </UploadDropZoneContainer>

      <UploadSection title="Visibility" icon={<VisibilityIcon />}>
        <RadioGroup
          value={visibilityField.state.value}
          onChange={(e) => visibilityField.handleChange(+e.target.value)}
          defaultValue="public"
          name="visibility-radio-buttons-group"
        >
          <RadioDescribedInput
            value={Visibility.PUBLIC}
            label="Public"
            description="Anyone can watch the video right away."
          />

          <RadioDescribedInput
            value={Visibility.UNLISTED}
            label="Unlisted"
            description="Only people with the link can watch the video."
          />

          <RadioDescribedInput
            value={Visibility.SCHEDULED}
            label="Scheduled"
            description="The video will be available at a specific date and time."
          />
        </RadioGroup>

        <Box
          sx={{
            transition: "opacity 0.3s ease, height 0.3s ease",
            opacity: isScheduledDateVisible ? 1 : 0,
            height: isScheduledDateVisible ? "auto" : 0,
            overflow: "hidden",
          }}
          marginTop={3}
          display="flex"
          justifyContent="start"
          alignItems="start"
        >
          <form.Field
            name="scheduledDate"
            children={(props) => (
              <DateTimePicker
                defaultValue={props.state.value}
                onChange={(value) => props.handleChange(value)}
                format="dd/MM/yyyy HH:mm"
              />
            )}
          />
        </Box>
      </UploadSection>

      <UploadSection title="Price" icon={<MonetizationOnIcon />}>
        <RadioGroup
          value={paymentModelField.state.value}
          aria-labelledby="cost-radiogroup"
          name="cost"
          onChange={(e) => paymentModelField.handleChange(+e.target.value)}
        >
          <RadioDescribedInput
            value={PaymentModel.FREE}
            label="Free"
            description="Anyone can access the video for free."
            {...paymentModelField}
          />

          <RadioDescribedInput
            value={PaymentModel.RENT}
            label="Rent"
            description="Viewers can rent the video for a limited time."
            {...paymentModelField}
          />

          <RadioDescribedInput
            value={PaymentModel.PURCHASE}
            label="Purchase"
            description="Viewers can buy the video to watch anytime."
            {...paymentModelField}
          />
        </RadioGroup>

        <Box
          sx={{
              transition: "opacity 0.3s ease, height 0.3s ease",
              opacity: isPriceVisible ? 1 : 0,
              height: isPriceVisible ? "auto" : 0,
              overflow: "hidden",
            }}
          marginTop={3}
          display="flex"
          justifyContent="start"
          alignItems="start"
        >
          <form.Field
            name="price"
            children={(props) => (
              <TextField
                {...props}
                inputProps={{
                  style: {
                    maxWidth: "20ch",
                  },
                }}
                handleChange={(value) => props.handleChange(formatNumberWithCommas(value))}
              />
            )}
          />

          <form.Field
            name="currency"
            children={(props) => (
              <Select
                onChange={(e) => props.handleChange(+e.target.value)}
                id="outlined-number"
                value={props.state.value}
                sx={{ marginLeft: "1rem" }}
              >
                <MenuItem value={Currency.USD}>USD</MenuItem>
                <MenuItem value={Currency.EUR}>EUR</MenuItem>
                <MenuItem value={Currency.ILS}>ILS</MenuItem>
              </Select>
            )}
          />
        </Box>
      </UploadSection>

      <UploadSection title="Content Restrictions" icon={<VisibilityIcon />}>
        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel control={<Checkbox />} label="Disable Tipping and Boosting" />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Block viewers from tipping or promoting your content.
          </FormHelperText>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel control={<Checkbox />} label="Hide Download Button" />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Prevent viewers from downloading this video.
          </FormHelperText>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel control={<Checkbox />} label="Disable Likes and Dislikes for Content" />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Turn off both likes and dislikes for the video.
          </FormHelperText>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Disable Likes and Dislikes for Comments"
          />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Turn off both likes and dislikes for comments.
          </FormHelperText>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel control={<Checkbox />} label="Disable Dislikes for Content" />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Only dislikes for the video will be hidden.
          </FormHelperText>
        </Box>

        <Box>
          <FormControlLabel control={<Checkbox />} label="Disable Dislikes for Comments" />
          <FormHelperText sx={{ marginLeft: "32px" }}>
            Only dislikes for comments will be hidden.
          </FormHelperText>
        </Box>
      </UploadSection>

      <Box width="100%" textAlign="center" margin="4rem 0">
        <Button variant="contained" type="submit">
          Upload
        </Button>
      </Box>
    </Container>
  );
};
