import React from "react";
import { Grommet, Box, Header, Anchor, Nav,  } from "grommet";
function NavigationBar2() {
  return (
    <Grommet>
      <Box
        as="header"
        background="brand"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <Header>
          <Nav>
            <Anchor href="/" color="white" size="large" weight="bold">
            <img src="../logo.svg" alt="logo"/>

              {/* <Logo height="40px" /> */}
            </Anchor>
          </Nav>
        </Header>
      </Box>
    </Grommet>
  );
}

export default NavigationBar2;
