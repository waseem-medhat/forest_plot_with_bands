library(data.table)
library(meta)

# dataset URL:
# https://github.com/VIS-SIG/Wonderful-Wednesdays/blob/master/data/2020/2020-11-11/BIG_DATA_PSI_WW_DEC2020.csv

dtf <- fread('BIG_DATA_PSI_WW_DEC2020.csv', stringsAsFactors = TRUE)

data_prep_bin <- function(data, summary_measure) {
  
  metadata <- data[
    !is.na(AVALCAT1N)
  ][,
    .(
      e_int = sum(TRT01P == 'INT' & AVALCAT1N == 0, na.rm = TRUE),
      n_int = sum(TRT01P == 'INT', na.rm = TRUE),
      e_soc = sum(TRT01P == 'SOC' & AVALCAT1N == 0, na.rm = TRUE),
      n_soc = sum(TRT01P == 'SOC', na.rm = TRUE),
      n = .N
    ),
    by = STUDYID
  ]
  
  metamodel <- metabin(
    event.e = e_int,
    n.e = n_int,
    event.c = e_soc,
    n.c = n_soc,
    sm = summary_measure,
    data = metadata
  )
  
  metadata_aug <- cbind(
    metadata[,.(STUDYID,n)],
    lo = exp(metamodel$lower),
    point = exp(metamodel$TE),
    hi = exp(metamodel$upper),
    sm = metamodel$sm
  )
  
  metadata_aug <- rbind(
    metadata_aug,
    data.table(
      STUDYID = c('Fixed', 'Random'),
      lo = exp(c(metamodel$lower.fixed, metamodel$lower.random)),
      point = exp(c(metamodel$TE.fixed, metamodel$TE.random)),
      hi = exp(c(metamodel$upper.fixed, metamodel$upper.random))
    ),
    fill = TRUE
  )
  
  return(metadata_aug)
}

metadata_or <- data_prep_bin(dtf, "OR")
metadata_rr <- data_prep_bin(dtf, "RR")

saveRDS(metadata_or, file = "data/metadata_or.rds")
saveRDS(metadata_rr, file = "data/metadata_rr.rds")