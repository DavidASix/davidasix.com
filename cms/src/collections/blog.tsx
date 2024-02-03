import { buildCollection, buildProperty, ExportMappingFunction, buildEntityCallbacks } from "firecms";
import { BlogEntryPreview } from "../custom_views/BlogEntryPreview";

export type BlogEntry = {
  title: string;
  sub_title: string;
  author: string;
  header_image: string;
  content: any[];
  publish_date: Date;
  status: string;
  tags: string[];
  created_on: Date;
  slug: string;
};

// Callbacks are super useful
// https://firecms.co/docs/collections/callbacks
const blogCallbacks = buildEntityCallbacks({
  onPreSave: ({
                  collection,
                  path,
                  entityId,
                  values,
                  previousValues,
                  status
              }) => {
      if (previousValues?.title !== values.title) {
        // return the updated values
        let slug = values.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
        const randomString = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${randomString}`;
        values.slug = slug
      }
      return values;
  },
});

export const blogCollection = buildCollection<BlogEntry>({
  path: "blog",
  name: "Blog",
  singularName: "Blog entry",
  group: "Content",
  icon: "Article",
  description:
    "A blog entry comprised of text, images, and quotes.",
  callbacks: blogCallbacks,
  textSearchEnabled: true,
  views: [
    {
      path: "preview",
      name: "Preview",
      Builder: BlogEntryPreview,
    },
  ],
  properties: {
    title: buildProperty({
      name: "Title",
      validation: { required: true },
      dataType: "string",
    }),
    sub_title: buildProperty({
      name: "Sub-Title",
      validation: { required: false },
      dataType: "string",
    }),
    author: buildProperty({
      name: "Author Name",
      validation: { required: false },
      dataType: "string",
    }),
    header_image: buildProperty({
      name: "Header image",
      dataType: "string",
      storage: {
        storagePath: "images",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
    }),
    content: buildProperty({
      name: "Content",
      description:
        "Your elements in Content will be displayed in order on the blog page.",
      validation: { required: true },
      dataType: "array",
      columnWidth: 400,
      oneOf: {
        typeField: "type",
        valueField: "value",
        properties: {
          text: {
            dataType: "string",
            name: "Text",
            markdown: true,
          },
          quote: {
            dataType: "string",
            name: "Quote",
            multiline: true,
          },
          images: {
            name: "Images",
            dataType: "array",
            of: buildProperty<string>({
              dataType: "string",
              storage: {
                storagePath: "images",
                acceptedFiles: ["image/*"],
                metadata: {
                  cacheControl: "max-age=1000000",
                },
              },
            }),
            description:
              "This fields allows uploading multiple images at once and reordering",
          },
        },
      },
    }),
    status: buildProperty(({ values }) => ({
      name: "Status",
      validation: { required: true },
      dataType: "string",
      columnWidth: 140,
      enumValues: {
        published: {
          id: "published",
          label: "Published",
          disabled: false,
        },
        draft: "Draft",
      },
      defaultValue: "draft",
    })),
    publish_date: buildProperty({
      name: "Publish date",
      dataType: "date",
      clearable: true,
    }),
    tags: {
      name: "Tags",
      description: "Tags link associated posts",
      dataType: "array",
      of: {
        dataType: "string",
        previewAsTag: true,
      },
      defaultValue: [],
    },
    created_on: {
      name: "Created on",
      description: "Automatically filled with todays date",
      dataType: "date",
      autoValue: "on_create",
      disabled: true
    },
    slug: buildProperty({
      name: "URL",
      description: "Automatically created based on title",
      dataType: "string",
      disabled: true
    }),
  },
});
