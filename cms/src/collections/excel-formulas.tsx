import { buildCollection, buildProperty } from "firecms";

export type Formula = {
  title: string;
  description: string;
  formula_with_whitespace: string;
  created_date: Date;
};

export const formulasCollection = buildCollection<Formula>({
  name: "Formulas",
  singularName: "Formula",
  path: "formulas",
  icon: "Functions",
  group: "Portfolio",
  description:
    "A list of Excel unique formula's I've created over the years. Used as a reference for me, and an example of my Excel work for employers",
  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    title: {
      name: "Title",
      validation: { required: true },
      dataType: "string",
    },
    description: {
      name: "Description",
      description: "Description of the formula",
      dataType: "string",
      multiline: true,
    },
    formula_with_whitespace: {
      name: "Formula with Whitespace",
      description: "This is the formula respecting whitespace",
      dataType: "string",
      multiline: true,
    },
    created_date: {
      name: "Created Date",
      validation: { required: true },
      description: "Automatically filled with todays date",
      dataType: "date",
      mode: 'date'
    },
  },
});
