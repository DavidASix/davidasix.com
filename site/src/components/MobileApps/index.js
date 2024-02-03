import cs from "src/styles/common.module.css";

export const MobileApp = (props) => {
    let app = {...props.app};
    console.log(app);
    return (
        <a 
            href={`/mobile-apps/${app.slug}`}
            className='col-4 col-md-2 row justify-content-center px-1 hover hover-danger grow'>
            <img
                src={app.appIcon}
                className='col-10 rounded-4 shadow'
                style={{aspectRatio: '1'}}
                aria-label={`${app.title} App Icon`} 
                alt={`${app.title} App Icon`}  />
            <span className="p-0 m-0 mt-1 fs-6 text-center">
                {app.title}
            </span>
        </a>
    );
}

export const MobileAppSkeleton = () => {
    return (
        <div
            className='col-3 col-md-2 row justify-content-center px-1'>
            <div
                className={`col-10 rounded-4 shadow ${cs.skeleton}`}
                style={{aspectRatio: '1'}} />
            <div 
                className={`${cs.skeleton} mt-2`}
                style={{width: '60%', height: '1.3rem'}} />
        </div>
    );
}