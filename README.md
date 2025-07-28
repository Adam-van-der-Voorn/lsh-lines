# LSH

A line grouping demo. Draw lines and they will be grouped by "similarity".

## what do we measure?

- not thickness. We should keep the demo simple and make all lines the same width.
- length - should be easy
- straightness. Also consider where on the line it's bendy or straight. So if you have a "J" shape
and an "S" shape, that have the same total "straightness", but in
different parts of the line, they should be dissimilar. 

## Run

serve the `public` dir, e.g.

    npx http-server ./public




