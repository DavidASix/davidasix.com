
import { buildCollection, buildProperty, buildEntityCallbacks } from "firecms";

export type MobileApp = {
    title: string;
    shortDescription: string;
    writeUp: string;
    googlePlayLink: string;
    appleStoreLink: string;
    githubLink: string;
    featureList: string[];
    technologyList: string[];
    appIcon: string;
    screenshots: string[];
    privacyPolicy: string;
    dataDelete: string;
    publishDate: Date;
    createdOn: Date;
    slug: string;
}

const callbacks = buildEntityCallbacks({
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
  

export const mobileAppCollection = buildCollection<MobileApp>({
    path: "mobile-apps",
    name: "Mobile Apps",
    singularName: "Mobile App",
    group: "Content",
    icon: "MobileApp",
    description: "A collection of mobile apps.",
    callbacks: callbacks,
    properties: {
        title: buildProperty({
            name: "Title",
            dataType: "string",
            validation: { required: true },
        }),
        shortDescription: buildProperty({
            name: "Short Description",
            dataType: "string",
            validation: { required: true },
        }),
        writeUp: buildProperty({
            name: "Write Up",
            dataType: "string",
            validation: { required: true },
            markdown: true,
        }),
        googlePlayLink: buildProperty({
            name: "Google Play Listing",
            dataType: "string",
            validation: { required: false },
            url: true,
        }),
        appleStoreLink: buildProperty({
            name: "Apple Store Listing",
            dataType: "string",
            validation: { required: false },
            url: true,
        }),
        githubLink: buildProperty({
            name: "GitHub Link",
            dataType: "string",
            validation: { required: false },
            url: true,
        }),
        featureList: {
          name: "Features",
          dataType: "array",
          description: "Non-restrictive list of features",
          of: {
            dataType: "string",
            previewAsTag: true,
          },
          defaultValue: [],
        },
        technologyList: buildProperty({
            name: "Technology Used",
            dataType: "array",
            of: {
              dataType: "string",
              previewAsTag: true,
            },
            defaultValue: [],
        }),
        appIcon: buildProperty({
            name: "App Icon",
            dataType: "string",
            storage: {
              storagePath: "images",
              acceptedFiles: ["image/*"],
              metadata: {
                cacheControl: "max-age=1000000",
              },
            },
        }),
        screenshots: buildProperty({
            name: "Screenshots",
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
        }),
        privacyPolicy: buildProperty({
            name: "Privacy Policy",
            dataType: "string",
            validation: { required: false },
            markdown: true,
        }),
        dataDelete: buildProperty({
            name: "Data Delete",
            dataType: "string",
            validation: { required: false },
            markdown: true,
        }),
        publishDate: {
          name: "Publish date",
          description: "This determines the order of the items in the list",
          dataType: "date",
          mode: "date",
        },
        createdOn: {
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

