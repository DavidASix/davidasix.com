import cs from 'src/styles/common.module.css';

export const Formula = ({title, description, formula_with_whitespace}) => (
    <div className={`container-fluid col-12 px-3`}>
      <h2 className={``}>{title}</h2>
      <p className={``}>
        {description}
      </p>
      <div className={`p-3 mt-3 mb-4 d-flex align-items-center frosted rounded-4`}>
        <code className={`p-0 m-0`}>
          <pre className="m-0" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{formula_with_whitespace}</pre>
        </code>
      </div>
    </div>
  );

 
export const FormulaSkeleton = ({index}) => (
  <div className={`container-fluid col-12 px-3`}>
    <div
        className={`m-0 p-0 ${cs.skeleton}`}
        style={{ width: "25%", height: "2rem" }}
      />
    
    <div
      className="p-0 m-0 pe-1 position-relative"
      style={{ flex: 1, maxHeight: 100, overflow: "hidden" }}
    >
      <div
        className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
        style={{ width: "100%", height: "1.1rem" }}
      />
      <div
        className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
        style={{ width: "100%", height: "1.1rem" }}
      />
      {index%2 ?(<div
        className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
        style={{ width: "100%", height: "1.1rem" }}
      />) : null}
    </div>

    <div className={`p-3 mt-3 mb-4 d-flex align-items-center frosted rounded-4`}>
      <div
        className="p-0 m-0 pe-1 position-relative"
        style={{ flex: 1, maxHeight: 100, overflow: "hidden" }}
      >
        <div
          className={`m-0 p-0 ${cs.skeleton}`}
          style={{ width: "70%", height: "0.9rem" }}
        />
        <div
          className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
          style={{ width: "80%", height: "0.9rem" }}
        />
        <div
          className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
          style={{ width: "40%", height: "0.9rem" }}
        />
        {index % 2 ? null : (<div
          className={`m-0 my-1 mx-1 p-0 ${cs.skeleton}`}
          style={{ width: "70%", height: "0.9rem" }}
        />)}
      </div>
    </div>
  </div>
);