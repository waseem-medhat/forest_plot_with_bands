library(shiny)
library(shinythemes)
library(r2d3)
library(shinyhelper)

ui <- fluidPage(
  theme = shinytheme('united'),
  title = 'Visualizing Heterogeneity in Meta-Analyses',

  tags$style('
    body {
      margin: 10px 20px;
    }
    footer {
      padding: 5px;
      text-align: right;
    }
    .shinyhelper-container i {
      font-size: 20px;
    }
    #control-panel {
      display: flex;
      align-items: center;
    }
    #forest-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  '),
  
  div(class = 'page-header',
      h1('Visualizing Heterogeneity in Meta-Analyses'),
      helper(content = 'interpretation',
             colour = 'teal',
             buttonLabel = 'OK',
             h3('Forest Plot with Heterogeneity Bands'))),
  
  fluidRow(column(6, 
                  h4('Treatment groups'),
                  p('Intensive antihypertensive therapy (treatment)
                    vs. standard of care (control)')),
           column(6,
                  h4('Outcome measure'),
                  p('Responder analysis - patients with controlled
                    systolic blood pressure at 1 year (≤ 120 mmHg)'))),
  
  wellPanel(style = 'margin: 20px auto;',
            fluidRow(id = 'control-panel',
                     column(2,
                            radioButtons('summary_measure',
                                         label = 'Choose summary measure:',
                                         choices = list('Odds ratio' = 'or',
                                                        'Risk ratio' = 'rr'))),
                     column(5,
                            sliderInput('d3_width',
                                        'Plot width:',
                                        value = 900,
                                        min = 650,
                                        max = 1300,
                                        step = 10,
                                        post = ' px')),
                     column(5,
                            sliderInput('d3_height',
                                        'Plot height:',
                                        value = 500,
                                        min = 350,
                                        step = 10,
                                        max = 800,
                                        post = ' px')))),
  
  div(id ='forest-container',
      style = 'min-height: 350px;',
      d3Output('d3Forest')),
  
  hr(),
  tags$footer('Built by Waseem Medhat for ',
              a('Wonderful Wednesdays',
                href = 'https://psiweb.org/sigs-special-interest-groups/visualisation/welcome-to-wonderful-wednesdays')))

server <- function(input, output) {
  observe_helpers()
  
  observe({
    metadata <- readRDS(
      sprintf('data/metadata_%s.rds', input$summary_measure)
    )    
    
    removeUI('#d3Forest')
    
    insertUI(
      selector = '#forest-container',
      where = 'afterBegin',
      ui = d3Output('d3Forest', height = input$d3_height, width = input$d3_width)
    )
    
    output$d3Forest <- renderD3({
      r2d3(metadata, script = 'src/forestWithBands.js')
    })
  })
  
}

shinyApp(ui = ui, server = server)
