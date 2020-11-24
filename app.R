library(shiny)
library(r2d3)

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
      ),
      hr(),
      actionButton('visualize', 'Visualize')
    ),
    mainPanel(
      width = 9,
      fluidRow(
        column(
          width = 10,
          offset = 1,
          div(
            id ='forestContainer',
            style = 'height: 400px;',
            d3Output('d3Forest')
          )
        )
      )
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
