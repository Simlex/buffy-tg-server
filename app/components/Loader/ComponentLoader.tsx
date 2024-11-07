import { FunctionComponent, ReactElement } from 'react';

interface ComponentLoaderProps {
    className?: string;
}

type ComponentLoaderV2Props = {

    /**
     * The optional classnames to be added
     */
    className?: string
}

const ComponentLoader: FunctionComponent<ComponentLoaderProps> = ({ className: classNamw }): ReactElement => {

    return (
        <div className={`w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin ${classNamw}`} />
    );
}

export default ComponentLoader;

export const ButtonLoader: FunctionComponent<ComponentLoaderV2Props> = (
    { className }): ReactElement => {

    return (
        <div className='absolute w-full h-full top-0 left-0 bg-white grid place-items-center pointer-events-none'>
            <div className={`w-6 h-6 border-4 border-orange-500 border-t-transparent border-solid rounded-full animate-spin ${className}`} />
        </div>
    );
}