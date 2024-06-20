export const Formula = (props) => {
  const { title, description, formula } = props;
  return (
    <div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="px-1">{description}</p>
      <div
        className={`p-3 mt-2 mx-2 d-flex align-items-center frosted rounded-2xl`}
      >
        <code className="whitespace-pre-wrap break-all">{formula}</code>
      </div>
    </div>
  );
};

export const FormulaSkeleton = () => (
  <div>
    <div className={`w-1/4 h-8 skeleton bg-white bg-opacity-10`} />

    <div className="py-2 space-y-2">
      <div className={`mx-2 w-full h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`mx-2 w-full h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`mx-2 w-11/12 h-5 skeleton bg-white bg-opacity-10`} />
    </div>

    <div
      className={`p-3 mt-2 mx-2 d-flex align-items-center frosted rounded-2xl space-y-3`}
    >
      <div className={`w-1/4 h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`w-1/2 h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`w-2/3 h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`w-1/3 h-5 skeleton bg-white bg-opacity-10`} />
      <div className={`w-1/2 h-5 skeleton bg-white bg-opacity-10`} />
    </div>
  </div>
);
