import { useState, useEffect, Fragment } from "react";
import { Grid, Box, useMediaQuery } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

import OpportunityService from "./services/opportunites.services";
import {
  CButton,
  IOpportunity,
  OpportunityCard,
  Size,
} from "@referrio/components";

const App = ({ domElement }: any) => {
  const [state, setState] = useState({
    opportunities: [] as any,
    lastKey: null,
    loadMoreDisabled: false,
    allOpportunities: [] as any,
  });

  // If you change this, you must also change in
  // svc-core - /opportunity/list/public/account/${accountId}
  const limit = 5;

  const accountId = domElement.getAttribute("account-id");
  const environment = domElement.getAttribute("instance");
  const url =
    environment === "local"
      ? "http://localhost:9000"
      : environment === "preview"
      ? "https://api.preview.referrio.com"
      : "https://api.referrio.com";
  const opportunityService = new OpportunityService(url);

  const getOpportunitiesByAccountId = async () => {
    const opps = await opportunityService.getOpportunitiesByAccount(
      accountId,
      state.lastKey
    );
    return opps;
  };

  const setOpportunities = async () => {
    const initialResp = await getOpportunitiesByAccountId();

    setState({
      ...state,
      opportunities: initialResp.opportunities,
      lastKey: initialResp.lastEvaluatedKey,
    });
  };

  const loadMore = async () => {
    const resp = await getOpportunitiesByAccountId();

    if (!resp?.opportunities || !resp?.lastEvaluatedKey) {
      setState({
        ...state,
        loadMoreDisabled: true,
      });
    }

    const updatedOpps = state.opportunities.concat(resp.opportunities);

    setState({
      ...state,
      opportunities: [...updatedOpps],
      lastKey: resp.lastEvaluatedKey ?? null,
      loadMoreDisabled:
        resp.opportunities.length < limit || !resp.lastEvaluatedKey,
    });
  };

  const redirectToReferView = (id: string) => {
    return (window.location.href = `https://referrio.com/refer-public/${id}`);
  };

  useEffect(() => {
    setOpportunities();
  }, []);

  const classes = useStyles();
  const theme = useTheme();
  const mdScreen = useMediaQuery(theme.breakpoints.up("md"));

  if (!accountId) {
    return <span>test</span>;
  }

  return (
    <Grid
      container
      fontFamily="Avenir !important"
      maxWidth={1440}
      pb="36px"
      alignItems="center"
      m="auto"
      flexGrow="1"
      alignContent="flex-start"
      mt={5}
      paddingX={`${mdScreen ? "40px" : "24px"}`}
    >
      <Grid container>
        <Box marginBottom={5} fontWeight="600 !important">
          <h2 className="hero">Latest Opportunities</h2>
        </Box>
        <Grid container direction="column" gap={2}>
          {!state.opportunities?.length ? (
            <span>
              <Grid className={classes["placeholder-content"]} item xs={12}>
                <p className={classes["placeholder-header"]}>
                  There are currently no open opportunities at the moment.
                </p>
                <p>
                  Come back again next time to find new and exciting
                  opportunities to make your referrals and get rewarded!
                </p>
              </Grid>

              <Grid item xs={12} md={12}>
                <PlaceholderImage
                  src={
                    "https://assets.referrio.com/placeholders/opportunity-placeholder.svg"
                  }
                  alt="placeholder"
                />
                <PlaceholderImage
                  src={
                    "https://assets.referrio.com/placeholders/opportunity-placeholder.svg"
                  }
                  alt="placeholder"
                />
              </Grid>
            </span>
          ) : (
            <Fragment>
              {(state.opportunities as IOpportunity[]).map(
                (data: any, index: any) => {
                  return (
                    <OpportunityCard
                      opportunity={data}
                      companyData={{
                        name: data.company.name,
                        url: data.company.url,
                        imageId: data.company.imageId,
                      }}
                      onClick={() => redirectToReferView(data.id)}
                      key={index}
                    />
                  );
                }
              )}

              <LoadMoreWrapper>
                <CButton
                  onClick={() => loadMore()}
                  disabled={state.loadMoreDisabled}
                  size={Size.medium}
                  secondary={false}
                >
                  <span className={classes["load-icon"]}>&#x21bb;</span> Load
                  more
                </CButton>
              </LoadMoreWrapper>
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;

const LoadMoreWrapper = styled("span")({
  marginTop: "16px",
  display: "flex",
  justifyContent: "center",
});

const PlaceholderImage = styled("img")({
  marginTop: "20px",
  width: "100%",
});

const useStyles = makeStyles({
  "center-form": {
    width: "50%",
    margin: "0 auto",
  },
  "mid-row-spacing": {
    marginTop: "4%",
    marginBottom: "4%",
  },
  module: {
    marginTop: "10%",
  },
  "check-icon": {
    fill: "#14AB3E",
    marginRight: "8px",
  },
  "placeholder-content": {
    textAlign: "center",
  },
  "placeholder-header": {
    marginTop: "40px",
    fontSize: "24px",
    fontWeight: "800",
  },
  "load-icon": {
    fontSize: "18px",
    fontWeight: "800",
    color: "white",
    marginRight: "4px",
  },
});
