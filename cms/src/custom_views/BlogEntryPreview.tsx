import React, { useEffect, useState } from "react";
import {
  Box,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import {
  Entity,
  EntityCustomViewParams,
  EntityReference,
  EntityValues,
  ErrorView,
  Markdown,
  useDataSource,
  useStorageSource,
} from "firecms";
import { BlogEntry } from "../collections/blog_collection";

/**
 * This is a sample view used to render the content of a blog entry.
 * It is bound to the data that is modified in the form.
 * @constructor
 */
export function BlogEntryPreview({
  modifiedValues,
}: EntityCustomViewParams<BlogEntry>) {
  const storage = useStorageSource();

  const [headerUrl, setHeaderUrl] = useState<string | undefined>();
  useEffect(() => {
    if (modifiedValues?.header_image) {
      storage
        .getDownloadURL(modifiedValues.header_image)
        .then((res) => setHeaderUrl(res.url));
    }
  }, [storage, modifiedValues?.header_image]);

  return (
    <Box>
      {headerUrl && (
        <img
          alt={"Header"}
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
          }}
          src={headerUrl}
        />
      )}

      <Container
        maxWidth={"sm"}
        sx={{
          mt: 4,
          justifyItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {modifiedValues?.title && (
          <Typography
            variant={"h3"}
            sx={{
              marginTop: "40px",
              marginBottom: "0px",
            }}
          >
            {modifiedValues.title}
          </Typography>
        )}
        {modifiedValues?.sub_title && (
          <Typography
            variant={"h4"}
            sx={{
              marginTop: "0px",
              marginBottom: "20px",
            }}
          >
            {modifiedValues.sub_title}
          </Typography>
        )}
        
          <Typography
            variant={"span"}
            sx={{
              marginTop: "0px",
              marginBottom: "20px",
            }}
          >
            by: {modifiedValues?.author && modifiedValues.author}
          </Typography>
      </Container>

      {modifiedValues?.content &&
        modifiedValues.content
          .filter((e: any) => !!e)
          .map((entry: any, index: number) => {
            if (entry.type === "text")
              return (
                <Text
                  key={`preview_text_${index}`}
                  markdownText={entry.value}
                />
              );
            if (entry.type === "images")
              return (
                <Images
                  key={`preview_images_${index}`}
                  storagePaths={entry.value}
                />
              );
            if (entry.type === "quote")
              return (
                <Quote key={`preview_quote_${index}`} quoteText={entry.value} />
              );
            return (
              <ErrorView
                key={`preview_images_${index}`}
                error={"Unexpected value in blog entry"}
              />
            );
          })}
    </Box>
  );
}

export function Images({ storagePaths }: { storagePaths: string[] }) {
  if (!storagePaths) return <></>;
  return (
    <Container
      maxWidth={"md"}
      sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <Box display="flex">
        {storagePaths.map((path, index) => (
          <Box
            p={2}
            m={1}
            key={`images_${index}`}
            sx={{
              width: 300,
              height: 300,
            }}
          >
            <StorageImage storagePath={path} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export function StorageImage({ storagePath }: { storagePath: string }) {
  const storage = useStorageSource();
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    if (storagePath) {
      storage.getDownloadURL(storagePath).then((res) => setUrl(res.url));
    }
  }, [storage, storagePath]);

  if (!storagePath) return <></>;

  return (
    <img
      alt={"Generic"}
      style={{
        objectFit: "contain",
        width: "100%",
        height: "100%",
      }}
      src={url}
    />
  );
}

function Text({ markdownText }: { markdownText: string }) {
  if (!markdownText) return <></>;

  return (
    <Container maxWidth={"sm"}>
      <Box mt={6} mb={6}>
        <Markdown source={markdownText} />
      </Box>
    </Container>
  );
}

function Quote({ quoteText }: { quoteText: string }) {
  if (!quoteText) return <></>;

  return (
    <Container maxWidth={"sm"} sx={{ borderLeft: "2px solid gray" }}>
      <Box mt={6} mb={6}>
        <Typography variant="h5" sx={{ fontStyle: "italic" }}>
          {quoteText}
        </Typography>
      </Box>
    </Container>
  );
}
