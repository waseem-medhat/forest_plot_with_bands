# Forest Plot with Heterogeneity Bands

> Note: this project was built as a submission for
> [Wonderful Wednesdays](https://psiweb.org/sigs-special-interest-groups/visualisation/welcome-to-wonderful-wednesdays).

Heterogeneity bands augment classic forest plots to provide a better
visualization of heterogeneity between studies.

- There is a band for each study, and its width is equal to that of the
corresponding confidence interval.
- All bands are transparent and superimposed over each other to visualize
the overlap between intervals. Overlap between bands produces darker areas.
- A visual indication of homogeneity is when darker areas take larger
proportions of the total width.

Low heterogeneity:

![low heterogeneity](helpfiles/low_het.png)

High heterogeneity:

![high heterogeneity](helpfiles/high_het.png)

## Technologies

The visualization is built with [D3.js](https://d3js.org/) and rendered in a
[Shiny](https://shiny.rstudio.com/) app using
[R2D3](https://rstudio.github.io/r2d3/).

## Live demo

Visit this link: https://waseem-medhat.shinyapps.io/forest_plot_with_bands/