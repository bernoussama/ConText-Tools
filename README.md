<h1 align="center">ConText Tools</h1>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/0ussamaBernou/ConText-Tools.svg)](https://github.com/0ussamaBernou/ConText-Tools/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/0ussamaBernou/ConText-Tools.svg)](https://github.com/0ussamaBernou/ConText-Tools/pulls)
  [![MIT License][license-shield]][license-url]
  [![Downloads](https://img.shields.io/github/downloads/0ussamaBernou/ConText-Tools/total)](https://github.com/0ussamaBernou/ConText-Tools/releases)

  <!-- [![Sponsors][sponsors-shield]][sponsors-url] -->
  <!-- [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt) -->
</div>

## Demo
[![Context Tools demo video](https://github.com/user-attachments/assets/0faf18a9-6150-4566-a2c5-39dba73879b8)](https://www.youtube.com/watch?v=DnzRztkV7nA)


## 👀 What is this?

ConText Tools is a Chrome extension designed to enhance your writing experience by providing a suite of powerful tools accessible with just a right-click. It streamlines the process of editing and refining text directly within your browser, making it a breeze to improve your work without interrupting your flow while also keeping your unique writing style if you want. The integration with the Gemini API is key to its functionality; when you select text, it gets sent to the Gemini API along with a system prompt that specifies the desired action, such as proofreading or making the text more concise and much more.
<br> 

---

## 📝 Table of Contents
- [Installation](#installation)
- [Problem Statement](#problem_statement)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Setting up a local environment](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)


## 💻 Installation <a name = "installation"></a>
1. download the latest `conteText_Tools.zip` file in releases.
2. unzip it
3. Open Chrome and type `chrome://extensions` in the address bar.
4. In the top right corner, enable Developer Mode by toggling the switch.
5. Click on the "Load unpacked" button that appears in the top left corner.
6. Select the unzipped folder. and the extension will be installed.
That's it! You should now see the extension in your Chrome browser.


## 🧐 Problem Statement <a name = "problem_statement"></a>
- IDEAL: The desired state for the Chrome extension is a seamless context menu that provides users with a variety of writing tools when they select text. This menu would include options for grammar checks, synonym suggestions, text summarization, and direct integration with popular writing platforms. The result would enhance user productivity by allowing quick access to essential writing tools without needing to switch applications.

- REALITY: Currently, users have to leave their browsing context to access writing tools, often relying on separate applications or websites. This separation disrupts the flow of work and makes it cumbersome to edit or enhance text while browsing. Many available tools lack direct integration with the browser, leading to inefficiencies and frustration.

- CONSEQUENCES: If this problem is not addressed, users may continue to experience decreased productivity and increased frustration. This could lead to a loss of time as they switch between applications, reduced quality in their writing due to limited access to tools, and ultimately a decline in user satisfaction and engagement with the writing process. In a competitive landscape, the inability to streamline writing tasks could push users toward alternative solutions that better meet their needs.

## 🚀 Future Scope <a name = "future_scope"></a>
One aspect we couldn't fully develop was creating an aesthetically appealing UI for the tooltip that would house the writing tools. While we had the functionality in mind, the design elements needed to ensure a smooth and engaging user experience were left unfinished. We envisioned a tooltip that not only provides quick access to the tools but also complements the overall look and feel of the browser, making it intuitive and visually pleasing.

Looking ahead, our project has the potential to evolve significantly. We aim to enhance the extension by allowing users to add custom text tools tailored to their individual needs. This feature would empower users to personalize their writing experience, bringing in tools that resonate with their specific workflows. By combining a refined UI with the ability to customize, we can create a powerful resource that adapts to various writing styles and preferences, ultimately elevating productivity and user satisfaction.

Additionally, we see the potential to support the upcoming Gemini Nano LLM, which promises to operate faster and provide enhanced security and privacy by running locally. By eliminating network overhead, users will benefit from a more responsive experience while maintaining the confidentiality of their writing. Integrating this capability into our extension could significantly enhance the writing process, making it not only more efficient but also more secure.

## 💡 Idea / Solution <a name = "idea"></a>
With a clear understanding of the ideal state, current reality, and potential consequences, we can explore focused solutions for our Chrome extension.

The primary solution involves integrating text tools directly into the context menu that appears when users select text. This approach allows users to access features like grammar checks, synonym suggestions, and text summarization instantly, right where they need them. By embedding these tools in the context menu, we eliminate the need for users to switch applications, streamlining their writing process.

Additionally, we can incorporate a feature that enables users to add custom text tools to the context menu. This customization would allow individuals to tailor their writing experience to suit their specific needs and preferences, enhancing the extension's overall value.

Another solution is to implement a tooltip that provides a quick preview of the available tools when users select text. This tooltip could highlight key features and offer instant access, making it even easier for users to engage with the writing tools without cluttering their workspace. The tooltip can serve as a visual guide that enhances the user experience, helping users discover the tools they may not have known were available.

Gathering user feedback during the development phase can further refine these features, ensuring they align with user expectations and create a seamless writing experience.

## ⛓️ Dependencies / Limitations <a name = "limitations"></a>
### Dependencies of the Project

1. **Gemini API:** This API provides the underlying functionality for the text tools, including grammar checks and synonym suggestions.
2. **React:** Used for building the user interface of the Chrome extension, allowing for a dynamic and responsive experience.
3. **TypeScript:** Provides type safety and enhances code maintainability, making it easier to manage the codebase.
4. **Tailwind CSS:** Utilized for styling the extension, ensuring a modern and visually appealing design.

### Limitations

1. **Integration of Content Script UI and Styles with Website Pages:**
   - **Description:** Achieving a seamless integration of the extension's UI with the styles of various website pages proved to be challenging. Ensuring that the tooltip and context menu appeared consistently and did not conflict with the site’s existing styles was difficult.
   - **Reason for Limitation:** Different websites have unique styling and layout approaches especially those using canvas, making it hard to create a one-size-fits-all solution that looks good across all contexts.
   - **Overcoming the Limitation:** The method chosen focused on using Tailwind CSS for flexibility; however, due to the diverse nature of web design, some conflicts were unavoidable, leading to inconsistencies.

2. **State Management Between Popup, Service Worker, and Content Script:**
   - **Description:** Managing the state across the popup, service worker, and content script caused complications, particularly in ensuring data consistency and responsiveness in the UI.
   - **Reason for Limitation:** The architecture of Chrome extensions relies on different contexts for different components, making synchronous communication challenging.
   - **Overcoming the Limitation:** While we implemented messaging between components, the inherent nature of asynchronous communication in Chrome extensions led to delays and potential data mismatch.

3. **Lack of Chrome Extension Documentation:**
   - **Description:** Insufficient documentation on best practices and common pitfalls for Chrome extension development limited our ability to troubleshoot issues effectively.
   - **Reason for Limitation:** As Chrome extensions continue to evolve, documentation may lag behind new features or changes in APIs, creating gaps in available resources.
   - **Overcoming the Limitation:** Although we sought out community resources and tutorials, the fragmented nature of available information still resulted in confusion and slowed progress.

### Impact of Limitations

Each limitation presents challenges that affect the overall functionality and user experience of the project:

- **Integration Issues:** The inconsistency in UI may detract from user satisfaction, as users expect a smooth, integrated experience. This could lead to frustration and reduced usage of the extension.
- **State Management Challenges:** Problems in data synchronization could lead to delays in tool availability, hindering productivity and reducing the effectiveness of the writing tools.
- **Documentation Gaps:** The lack of comprehensive resources may lead to longer development times and increased bugs, which can compromise the extension's reliability and performance.

### Need for Further Research

These limitations highlight areas that warrant further investigation. Future research could focus on:

- Developing more robust styling methodologies that account for varying website designs.
- Exploring advanced state management libraries or patterns tailored for Chrome extensions.
- Contributing to or advocating for improved documentation and community resources regarding Chrome extension development.

By addressing these areas, we can enhance the extension's functionality and ensure a more seamless user experience moving forward.


## 🏁 Getting Started <a name = "getting_started"></a> 
These instructions will get you a copy of the project up and running on your local machine for development 
and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites
install `node` or `bun`, i personally prefer bun it's easier and faster to get installed and also faster to run.
to install bun on Linux & MacOs:
```bash
curl -fsSL https://bun.sh/install | bash
```
to install node.js on Linux & MacOs:
```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# download and install Node.js (you may need to restart the terminal)
nvm install 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.16.0`
# verifies the right npm version is in the environment
npm -v # should print `10.8.1`
```
for more info check out the official website of bun and node.js :
- [Bun](https://bun.sh/) 
- [NodeJs](https://nodejs.org/en/)

### Setup
1. Clone the repository:

   ```bash
   git clone https://github.com/0ussamaBernou/ConText-Tools
   ```

2. Navigate to the project directory and install dependencies:

   ```bash
   bun install #or npm install
   ```

### Scripts Available

In the project directory, you can run:

#### development mode

```bash
# Runs the app in the development mode.
# Will open a new browser instance with your extension loaded.
# The page will reload when you make changes.
bun run dev #or npm run dev
```

#### Production mode

```bash
# Runs the app in the production mode.
# Will open a new browser instance with your extension loaded.
# This is how your browser extension will work once published.
bun run start #or npm run start
```


## 📤 Deployment <a name="deployment"></a>

### Production build

```bash
# Builds the app for production.
# Bundles your browser extension in production mode for the target browser.
bun run build #or npm run build
```

### Adding Extension to Chrome <a name="install"></a>
1. Open Chrome and type `chrome://extensions` in the address bar.
2. In the top right corner, enable Developer Mode by toggling the switch.
3. Click on the "Load unpacked" button that appears in the top left corner.
4. Select the `dist/chrome` folder from the cloned repository. and the extension will be installed.
That's it! You should now see the extension in your Chrome browser.


## 🎈 Usage <a name="usage"></a>
Select text you want to edit, right click on the selection, hover over "ConText Tools" and choose from the provided tools 


## ⛏️ Built With <a name = "tech_stack"></a>
- [Extension.js](https://extension.js.org) -  Extension development tool
- [React](https://react.dev/) - Web Library
- [Bun](https://bun.sh/) - Dev environment
- [NodeJs](https://nodejs.org/en/) - Dev Environment


## ✍️ Authors <a name = "authors"></a>
- [@0ussamaBernou](https://github.com/0ussamaBernou) - Idea & Initial work

See also the list of [contributors](https://github.com/0ussamaBernou/ConText-Tools/contributors) 
who participated in this project.


## 🎉 Acknowledgments <a name = "acknowledgments"></a>

- Google's Gemini API for providing AI capabilities.
> This project was bootstrapped using the Extension.js React-TypeScript template.
You can learn more in the [Extension.js](https://extension.js.org) documentation.
- https://github.com/race2infinity/The-Documentation-Compendium

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/0ussamaBernou/ConText-Tools?color=blue
[license-url]: LICENSE.txt
[sponsors-shield]: https://img.shields.io/github/sponsors/0ussamaBernou
[sponsors-url]: https://github.com/sponsors/0ussamaBernou
