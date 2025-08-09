// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-resume",
          title: "Resume",
          description: "This resume only includes work and educational background as the rest are placed in separate tabs on the website.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/resume/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Publications by categories in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "My projects live here. Back then, I wasn’t in the habit of uploading my work, but I’ve been adopting better programming practices. More projects will be added as I keep building, stay tuned!",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-certifications",
          title: "Certifications",
          description: "Credentials earned from completing online courses and internships.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/coursework/";
          },
        },{id: "nav-recognitions",
          title: "Recognitions",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/awardsandscholarships/";
          },
        },{id: "nav-volunteering",
          title: "Volunteering",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/volunteer/";
          },
        },{id: "nav-references",
          title: "References",
          description: "Exceptional individuals I have worked with or under, who are kindly willing to provide feedback upon request.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/references/";
          },
        },{id: "news-got-hired-as-a-teaching-assistant-for-biol-3070-computational-approaches-to-biology-for-the-fall-2025-semester",
          title: 'Got hired as a Teaching Assistant for BIOL 3070 - Computational Approaches to...',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
