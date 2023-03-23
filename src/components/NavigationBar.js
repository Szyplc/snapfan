import React from "react";
import { Grommet, Box, Header, Anchor, Nav, TextInput } from "grommet";
import { FormSearch } from "grommet-icons";
import Logo from "../logo.svg";

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
            <Anchor href="/" color="white" size="large" weight="bold">
            <img src="../logo.svg" alt="logo"/>

              {/* <Logo height="40px" /> */}
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
