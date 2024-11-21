import { useDropzone } from "react-dropzone";
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
import { getUploadUrl } from "@/auth/api/uploadUrl";
import axios from "axios";
import { UploadDropZoneContainer } from "@/components/UploadDropZoneContainer";
import { useMutation } from "@tanstack/react-query";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { grey } from "@mui/material/colors";
import { useForm } from "@tanstack/react-form";

import TextField from "@/components/TextField";
import { RadioDescribedInput } from "@/components/RadioDescribedInput";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { UploadInput } from "@/components/UploadInput";
import { Currency, PaymentModels, Visibility } from "@/types/upload";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

interface MediaUploadValues {
  video: null | File;
  title: string;
  description: string;
  thumbnail: null | File;
  paymentModel: PaymentModels;
  price: string;
  currency: Currency;
  visibility: Visibility;
  scheduledDate?: DateTime | null;
}

// const schema = Yup.object<MediaUploadValues>().shape({
//   video: Yup.mixed().nullable().required("Video is required."),
//   title: Yup.string().required("Title is required."),
//   description: Yup.string().nullable(),
//   thumbnail: Yup.mixed().nullable(),
//   paymentModel: Yup.string().oneOf(["FREE", "PAID"]).required(),
//   price: Yup.string().when("paymentModel", {
//     is: "PAID",
//     then: Yup.string().required("Price is required."),
//     otherwise: Yup.string(),
//   }),
//   currency: Yup.string().required("Currency is required."),
//   visibility: Yup.string().required("Visibility is required."),
//   scheduledDate: Yup.date().nullable(),
// });

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

export const MediaUpload = () => {
  const form = useForm<MediaUploadValues>({
    defaultValues: {
      video: null,
      title: "",
      description: "",
      thumbnail: null,
      paymentModel: PaymentModels.FREE,
      price: "",
      currency: Currency.USD,
      visibility: Visibility.PUBLIC,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value.video) return;
    },
  });

  const { mutate, data } = useMutation({
    mutationFn: getUploadUrl,
    // onSuccess: () => form.validateField(),
    onError: () => {},
  });

  const uploadFile = async (url: string, file: File) => {
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  };

  const videoField = form.useField({
    name: "video",
  });

  const thumbnailField = form.useField({
    name: "thumbnail",
  });

  const videoDropZoneProps = useDropzone({
    onDrop: ([file], [rejection]) => {
      videoField.setMeta((prev) => ({
        ...prev,
        errorMap: {
          onChange: rejection?.errors?.at(0)?.message,
        },
      }));

      videoField.handleChange(() => rejection?.file ?? file);
    },
    accept: {
      "video/mp4": [".mp4"],
      "video/mpeg": [".mpeg"],
      "video/webm": [".webm"],
    },
    maxFiles: 1,
    maxSize: 16 * 1024 ** 3, // 16 GiB
  });

  const thumbnailDropZoneProps = useDropzone({
    onDrop: ([file], [rejection]) => {
      thumbnailField.setMeta((prev) => ({
        ...prev,
        errorMap: {
          onChange: rejection?.errors?.at(0)?.message,
        },
      }));

      thumbnailField.handleChange(() => rejection?.file ?? file);
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 ** 2, // 5 MiB
  });

  const paymentModelField = form.useField({
    name: "paymentModel",
  });
  const isPriceVisible = paymentModelField.state.value !== PaymentModels.FREE;

  const visibilityField = form.useField({
    name: "visibility",
  });
  const isScheduledDateVisible = visibilityField.state.value === Visibility.SCHEDULED;

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
            value={PaymentModels.FREE}
            label="Free"
            description="Anyone can access the video for free."
            {...paymentModelField}
          />

          <RadioDescribedInput
            value={PaymentModels.RENT}
            label="Rent"
            description="Viewers can rent the video for a limited time."
            {...paymentModelField}
          />

          <RadioDescribedInput
            value={PaymentModels.PURCHASE}
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
