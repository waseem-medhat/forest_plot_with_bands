library(shiny)
library(shinythemes)
library(r2d3)
library(shinyhelper)

ui <- fluidPage(
  theme = shinytheme('united'),
  style = 'margin: 10px 20px;',
  
  div(
    class = 'page-header',
    h1('Visualizing Heterogeneity in Meta-Analyses'),
    helper(
      h3('Forest Plot with Heterogeneity Bands'),
      content = 'interpretation',
      size = 'l'
    )
  ),
  
  sidebarLayout(
    sidebarPanel(
      radioButtons(
        'summary_measure',
        label = 'Choose summary measure:',
        choices = list('Odds Ratio' = 'or', 'Risk Ratio' = 'rr')
      ),
      hr(),
      actionButton('visualize', 'Visualize')
    ),
    mainPanel(
      fluidRow(
        div(
          id ='forestContainer',
          style = 'height: 400px;',
          d3Output('d3Forest')
        )
      )
    )
  ),
)

server <- function(input, output) {
  observe_helpers()
  
  metadata <- eventReactive(input$visualize, {
    readRDS(
      sprintf('data/metadata_%s.rds', input$summary_measure)
    )
  })
  
  observeEvent(input$visualize, {
    removeUI('#d3Forest')
    insertUI(
      selector = '#forestContainer',
      where = 'beforeEnd',
      ui = d3Output('d3Forest')
    )
    
    output$d3Forest <- renderD3({
      r2d3(metadata(), script = 'src/forestWithBands.js')
    })
    
  })
  
}

shinyApp(ui = ui, server = server)
