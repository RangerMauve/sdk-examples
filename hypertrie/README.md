# Hypertrie example

This example shows you how you can create a hypertrie (a sort of key-value store) and replicate it between two browser tabs.

A `creator` tab will create the hypertrie, and a `viewer` tab will load it from the other peer over the Dat networking using Hypercore and the SDK.

The `creator` will save the `dat://` URL in the browser's `localStorage` so that it can be reused later.

Please note that you should be using two different browsers for the `creator` and `viewer` so that they don't share storage.

To run this example, go to the root of the examples repo and execute `npm run hypertrie`.