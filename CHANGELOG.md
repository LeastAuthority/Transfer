# Changelog

# Changes between v0.0.4-alpha.plus.rc7 and v0.1

- official release Alpha+ milestone
- version tag moved to page title (#1260)
- fix opening a received link while on Send/Default fails to load Receive/Consent (#1238)
- adjusted cancelation message (#1189)

# Changes between v0.0.4-alpha.plus.rc7 and v0.0.4-alpha.plus.rc6:

- resolve eventsource dependency version to a value above 2.0.2 to get
  a security fix (#117)
- Cancellation workaround (#118)

# Changes between v0.0.4-alpha.plus.rc6 and v0.0.4-alpha.plus.rc5:

- (first release after switching to openproject)
- Fix autocomplete for chrome on android (#114)
- Add prettier (#113)
- docker: transit-relay submodule has been removed, so remove references (#112)
- use insecure websocket urls for localhost access (#111)
- Improve word suggestion popover. (#110)
- Add storybook (#109)
- Remove version from package.json (#108)
- Fix handling of ErrBadCode (#107)
- Fix build script command (#106)

# Changes between v0.0.4-alpha.plus.rc5 and v0.0.4-alpha.plus.rc4:

- move config out of source code [PR: #97](https://github.com/LeastAuthority/Transfer/pull/97)
- get rid of the relay server submodule [PR: #99](https://github.com/LeastAuthority/Transfer/pull/99)

# Changes between v0.0.4-alpha.plus.rc4 and v0.0.4-alpha.plus.rc3:

- increase the sender timeout on the frontend to 10 minutes [PR: 80](https://github.com/LeastAuthority/Transfer/pull/80)
- get rid of connection timeouts of 5 seconds in wormhole-william for direct and relay connections [PR: 46](https://github.com/LeastAuthority/wormhole-william/pull/46)

# Changes between v0.0.4-alpha.plus.rc3 and v0.0.4-alpha.plus.rc2:

- create build script [PR: #91](https://github.com/LeastAuthority/Transfer/pull/91)
- The PR also reverts to using backend configurations in the code rather than
  in the environment variables.

# Changes between v0.0.4-alpha.plus.rc2 and v0.0.4-alpha.plus.rc1:

- cancellation implementation [PR: #78](https://github.com/LeastAuthority/Transfer/pull/78)
- send side streaming [PR: #67](https://github.com/LeastAuthority/Transfer/pull/67)
- error messaging [PR: #82](https://github.com/LeastAuthority/Transfer/pull/82)
