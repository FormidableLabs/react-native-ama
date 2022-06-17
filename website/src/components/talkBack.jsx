import * as React from 'react';

export const TalkBackList = () => {
    return (
        <p>With a native app, TalkBack, to announce when the user focuses or leaves a list for the first time. This info
            is additionally provided as <strong>in list</strong> (or <strong>in grid</strong>), and <strong>out of
                list</strong> (or <strong>out of the grid</strong>).
            This behaviour is missing in ReactNative as the FlatList uses a ScrollView instead of the native <a
                href="https://developer.android.com/guide/topics/ui/layout/recyclerview" target="_blank"
                rel="noopener noreferrer">RecyclerView</a> one.</p>)
}
