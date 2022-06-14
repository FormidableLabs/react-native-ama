import * as React from 'react';

export const DevOnly = () => {
    return (
        <span className="dev-only-wrap" title="This action is executed only when running the app in __DEV__ mode">
            <span className="dev-only">DEV only</span>
        </span>
    )
}
