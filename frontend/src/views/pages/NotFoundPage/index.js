import { useEffect } from 'react';
export const NotFoundPage = () => {
    useEffect(() => {
        document.title = 'Not found / Demo social';
    }, []);
    return (
        <div>
            <h1>No page founded</h1>
        </div>
    );
};