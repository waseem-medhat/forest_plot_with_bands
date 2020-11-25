library(shiny)
library(shinythemes)
library(r2d3)
library(shinyhelper)

ui <- fluidPage(
  theme = shinytheme('united'),
  #style = 'margin: 10px 20px;',
  tags$style('
    body {
      margin: 10px 20px;
    }
    .shinyhelper-container i {
      font-size: 20px;
    }
  '),
  
  div(
    class = 'page-header',
    h1('Visualizing Heterogeneity in Meta-Analyses'),
    helper(
      h3('Forest Plot with Heterogeneity Bands'),
      content = 'interpretation',
      colour = 'teal',
      size = 'l',
      buttonLabel = 'OK'
    )
  ),
  
  sidebarLayout(
    sidebarPanel(
      h4('Treatment group'),
      p('Intensive antihypertensive therapy'),
      hr(),
      h4('Control group'),
      p('Standard of care'),
      hr(),
      h4('Outcome measure'),
      p('Responder analysis - patients with controlled systolic blood pressure at 1-Year (<=120 mmHg)'),
      hr(),
      radioButtons(
        'summary_measure',
        label = 'Choose summary measure:',
        choices = list('Odds ratio' = 'or', 'Risk ratio' = 'rr')
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
  )
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
