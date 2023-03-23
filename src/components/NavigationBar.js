import React from "react";
import { Grommet, Box, Header, Anchor, Nav, TextInput } from "grommet";
import { FormSearch } from "grommet-icons";

function NavigationBar({ handleSearchChange }) {
  return (
    <Grommet>
      <Box
        as="header"
        background="brand"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <Header>
          <Nav>
            <Anchor href="/" color="white" size="large" weight="bold" style={{ marginLeft: "5px" }}>
              <img src="/logop.png" alt="logo" />
             </Anchor>  
          </Nav>
          <Box direction="row" justify="end" gap="medium" align="center">
            <FormSearch color="white" size="large" />
            <TextInput
              type="search"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </Box>
        </Header>
      </Box>
    </Grommet>
  );
}

export default NavigationBar;
