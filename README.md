# zoomzi

Remember Prezi for presentations where you can zoom in to parts of your presentation?

Here what we offer is a way for you to setup a ggplot and then setup the slides so that you can zoom in to them as needed. 

This is fully inspired by Emil's revealjs-plugin [editable](https://github.com/EmilHvitfeldt/quarto-revealjs-editable). All credit in the structure of this package goes to their package.

The way to use this plugin is to first set the zoomDev config value to true, so that you can set the zoom points that you want to select

Then once you are done setting the zoom points, copy the zoomState string from the tools section and paste it as a zoomState

Then set zoomDev to false so that the zoom animations can start working

There's also the option to set zoomScale to a value
