library(shiny)
library(r2d3)

metadata_or <- readRDS('data/metadata_or.rds')
metadata_rr <- readRDS('data/metadata_rr.rds')

ui <- fluidPage(
  
  div(
    class = 'page-header',
    h1('Visualizing Heterogeneity in Meta-Analyses'),
    h3('Forest Plot with Heterogeneity Bands')
  ),
  
  sidebarLayout(
    sidebarPanel(
      width = 3,
      radioButtons(
        'summary_measure',
        label = 'Choose summary measure:',
        choices = list('Odds Ratio' = 'or', 'Risk Ratio' = 'rr')
      )
    ),
    mainPanel(
      width = 9,
      fluidRow(column(width = 10, offset = 1, d3Output('forest')))
    )
  ),
  hr(),
  
  h3('How to interpret?'),
  tags$ul(
    tags$li(
      'The bands augment the classic forest plot to provide a better visualization of heterogeneity of effect among studies.'
    ),
    tags$li(
      'They '
    ),
    tags$li(
      'How it works:',
      tags$ul(
        tags$li('Shades')
      )
    )
  )
)

server <- function(input, output) {
  output$forest <- renderD3(
    r2d3(metadata_rr, 'src/forestWithBands.js')
  )
}

shinyApp(ui = ui, server = server)
