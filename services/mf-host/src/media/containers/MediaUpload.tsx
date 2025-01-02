import { DropzoneOptions } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "@tanstack/react-router";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  RadioGroup,
  Select,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { grey } from "@mui/material/colors";
import {
  Controller,
  useForm,
  SubmitHandler,
  UseFormSetValue,
  UseFormSetError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioDescribedInput } from "@/components/RadioDescribedInput";
import { DateTimePicker } from "@mui/x-date-pickers";

import { UploadInput } from "@/components/inputs/Upload/UploadInput";
import { UploadDropZoneContainer } from "@/components/inputs/Upload/UploadDropZoneContainer";
import { mediaSchema } from "@/schemas/mediaSchema";
import { MediaSchema } from "@/types/media";
import { LadledSection } from "@/components/layout/LadledSection";
import {
  ACCEPT_IMAGE_TYPES,
  ACCEPT_VIDEO_TYPES,
  THUMBNAIL_MAX_SIZE,
  VIDEO_MAX_SIZE,
} from "@/config/upload";
import { TextField } from "@/components/inputs/TextField";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { getSignUrlArgs } from "@/utils/uploads";
import {
  getThumbnailUploadUrl,
  getVideoUploadUrl,
  uploadPresignedURLFile,
} from "@/media/api/upload";
import { createMedia } from "@/media/api/media";
import { Currency, PaymentModel, Visibility } from "@/types";

const handleDropZone =
  (
    key: keyof MediaSchema,
    setValue: UseFormSetValue<MediaSchema>,
    setError: UseFormSetError<MediaSchema>,
  ): DropzoneOptions["onDrop"] =>
  ([file], [rejection]) => {
    setValue(key, rejection?.file ?? file);
    setError(key, {
      message: rejection?.errors?.at(0)?.message,
      type: "onChange",
    });
  };

export const MediaUpload = () => {
  const router = useRouter();
  const { control, handleSubmit, setError, setValue, reset } = useForm<MediaSchema>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: Visibility.SCHEDULED,
      paymentModel: PaymentModel.PURCHASE,
      currency: Currency.USD,
      price: "",
    },
    mode: "all",
  });

  const handleFormSubmit: SubmitHandler<MediaSchema> = async (values) => {
    const { video, thumbnail, price, scheduledDate, ...rest } = values;
    const videoSignUrlArgs = await getSignUrlArgs(video);
    const thumbnailSignUrlArgs = await getSignUrlArgs(thumbnail);

    const {
      data: { key: videoKey, url: videoUploadUrl },
    } = await getVideoUploadUrl(videoSignUrlArgs);
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

    await uploadPresignedURLFile(thumbnailURL, thumbnail, thumbnailSignUrlArgs);
    await uploadPresignedURLFile(videoUploadUrl, video, videoSignUrlArgs);

    await router.navigate({
      to: "/",
    });
  };

  return (
    <Container maxWidth="md" component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Controller
        name="video"
        control={control}
        render={({ field, fieldState, formState }) => (
          <UploadDropZoneContainer
            accept={ACCEPT_VIDEO_TYPES}
            maxSize={VIDEO_MAX_SIZE}
            onDrop={handleDropZone(field.name, setValue, setError)}
          >
            <LadledSection
              title="Upload file"
              icon={<CloudUploadIcon />}
              actions={
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  variant="contained"
                  size="small"
                  startIcon={<RefreshIcon />}
                >
                  Reset
                </Button>
              }
            >
              <UploadInput
                field={field}
                fieldState={fieldState}
                formState={formState}
                helperText="For video content, use MP4s in H264/AAC format and a friendly bitrate (under 8 Mbps)."
              />

              <Box onClick={(e) => e.stopPropagation()} paddingTop="3rem">
                <Controller
                  control={control}
                  name="title"
                  render={(props) => <TextField {...props} />}
                />
              </Box>
            </LadledSection>
          </UploadDropZoneContainer>
        )}
      />

      <LadledSection htmlFor="description" title="description" icon={<DescriptionIcon />}>
        <Controller
          control={control}
          name="description"
          render={(props) => <TextField {...props} minRows={2} maxRows={15} omitLabel />}
        />
      </LadledSection>

      <Controller
        name="thumbnail"
        control={control}
        render={({ field, fieldState, formState }) => (
          <UploadDropZoneContainer
            onDrop={handleDropZone("thumbnail", setValue, setError)}
            accept={ACCEPT_IMAGE_TYPES}
            maxSize={THUMBNAIL_MAX_SIZE}
          >
            <LadledSection title={field.name} icon={<ImageIcon />}>
              <Box display="flex" minHeight={256} gap={2}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flex={2}
                  fontSize={40}
                  sx={{ background: grey["200"] }}
                >
                  {field.value ? (
                    <img
                      src={field.value && URL.createObjectURL(field.value)}
                      alt="Thumbnail Preview"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  ) : (
                    <ImageOutlinedIcon />
                  )}
                </Box>
                <Box flex={3}>
                  <UploadInput
                    field={field}
                    fieldState={fieldState}
                    formState={formState}
                    helperText="Use JPEG, PNG, or WEBP formats, with a maximum size of 5MB."
                  />
                </Box>
              </Box>
            </LadledSection>
          </UploadDropZoneContainer>
        )}
      />
      <Controller
        control={control}
        name="visibility"
        render={({ field }) => (
          <LadledSection title="Visibility" icon={<VisibilityIcon />}>
            <RadioGroup
              value={field.value}
              onChange={(e) => field.onChange(+e.target.value)}
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
                opacity: field.value === Visibility.SCHEDULED ? 1 : 0,
                height: field.value === Visibility.SCHEDULED ? "auto" : 0,
                overflow: "hidden",
              }}
              marginTop={3}
              display="flex"
              justifyContent="start"
              alignItems="start"
            >
              <Controller
                control={control}
                name="scheduledDate"
                render={({ field, fieldState }) => (
                  <DateTimePicker
                    defaultValue={field.value}
                    onChange={(value) => field.onChange(value)}
                    format="dd/MM/yyyy HH:mm"
                    slotProps={{
                      textField: {
                        error: !!fieldState.error?.message,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
          </LadledSection>
        )}
      />
      <Controller
        control={control}
        name="paymentModel"
        render={({ field }) => (
          <LadledSection title="price" icon={<MonetizationOnIcon />}>
            <RadioGroup
              value={field.value}
              aria-labelledby="cost-radiogroup"
              name="cost"
              onChange={(e) => {
                if (+e.target.value === PaymentModel.FREE) {
                  setValue("price", "");
                }
                field.onChange(+e.target.value);
              }}
            >
              <RadioDescribedInput
                value={PaymentModel.FREE}
                label="Free"
                description="Anyone can access the video for free."
              />

              <RadioDescribedInput
                value={PaymentModel.RENT}
                label="Rent"
                description="Viewers can rent the video for a limited time."
              />

              <RadioDescribedInput
                value={PaymentModel.PURCHASE}
                label="Purchase"
                description="Viewers can buy the video to watch anytime."
              />
            </RadioGroup>
            <Box
              sx={{
                transition: "opacity 0.3s ease, height 0.3s ease",
                opacity: field.value !== PaymentModel.FREE ? 1 : 0,
                height: field.value !== PaymentModel.FREE ? "auto" : 0,
                overflow: "hidden",
              }}
              marginTop={1}
              paddingTop={1}
              display="flex"
              justifyContent="start"
              alignItems="start"
            >
              <Controller
                control={control}
                name="price"
                render={(props) => (
                  <TextField
                    {...props}
                    onChange={({ target }) =>
                      props.field.onChange(formatNumberWithCommas(target.value))
                    }
                    sx={{
                      maxWidth: "20ch",
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    onChange={(e) => field.onChange(+e.target.value)}
                    id="outlined-number"
                    value={field.value}
                    sx={{ marginLeft: "1rem" }}
                  >
                    <MenuItem value={Currency.USD}>USD</MenuItem>
                    <MenuItem value={Currency.EUR}>EUR</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </LadledSection>
        )}
      />

      <LadledSection title="Content Restrictions" icon={<VisibilityIcon />}>
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
      </LadledSection>
      <Box width="100%" textAlign="center" margin="4rem 0">
        <Button variant="contained" type="submit">
          Upload
        </Button>
      </Box>
    </Container>
  );
};
