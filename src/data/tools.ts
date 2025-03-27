export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon?: string;
};

export const categories: Category[] = [
  {
    id: "text-generation",
    name: "Text Generation",
    description: "Tools that generate human-like text for various purposes",
    icon: "pen-line",
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Tools that create images from text descriptions",
    icon: "image",
  },
  {
    id: "coding",
    name: "Coding",
    description: "AI assistants for writing, debugging, and understanding code",
    icon: "code",
  },
  {
    id: "audio",
    name: "Audio & Speech",
    description: "Tools for creating and manipulating audio content",
    icon: "mic",
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "AI tools to boost workflow efficiency and productivity",
    icon: "zap",
  },
  {
    id: "research",
    name: "Research & Learning",
    description: "Tools for information gathering and learning",
    icon: "book-open",
  },
];

export const tools: Tool[] = [
  // File Sharing & Storage Tools
  {
    id: "ToffeeShare",
    name: "ToffeeShare",
    description: "Private & secure file transfer, without size limit",
    url: "https://toffeeshare.com/",
    category: "File Sharing",
    icon: "placeholder_icon_toffeeshare",
  },

  // Productivity Tools
  {
    id: "NeverInstall",
    name: "Never Install",
    description: "Cloud-based application access",
    url: "https://neverinstall.com/en-GB?ref=betalist",
    category: "productivity",
    icon: "placeholder_icon_neverinstall",
  },

  // Software Download Platforms
  {
    id: "FileCR",
    name: "FileCR",
    description: "The biggest software store",
    url: "https://filecr.com/en/?id=94415884416",
    category: "Software Downloads",
    icon: "placeholder_icon_filecr",
  },
  {
    id: "4DOWNLOAD",
    name: "4DOWNLOAD",
    description: "Software download platform",
    url: "https://4download.net/index.php",
    category: "Software Downloads",
    icon: "placeholder_icon_4download",
  },
  {
    id: "FreeSoftwareFiles",
    name: "Free Software Files",
    description: "Latest PC software reviews and free downloads",
    url: "https://www.freesoftwarefiles.com/",
    category: "Software Downloads",
    icon: "placeholder_icon_freesoftware",
  },
  {
    id: "ALLPCWorld",
    name: "ALL PC World",
    description: "Free apps one click away",
    url: "https://allpcworld.com/",
    category: "Software Downloads",
    icon: "placeholder_icon_allpcworld",
  },

  // Privacy & Security Tools
  {
    id: "JustDeleteMe",
    name: "Just Delete Me",
    description:
      "A directory of direct links to delete your account from web services",
    url: "https://justdeleteme.xyz/",
    category: "Privacy",
    icon: "placeholder_icon_justdeleteme",
  },
  {
    id: "HiddenTools",
    name: "Hidden Tools",
    description: "Discover a collection of tools",
    url: "https://hiddentools.dev/",
    category: "Utilities",
    icon: "placeholder_icon_hiddentools",
  },

  // Creative Tools
  {
    id: "LMMS",
    name: "LMMS",
    description: "Open-source digital audio workstation",
    url: "https://lmms.io/",
    category: "audio",
    icon: "placeholder_icon_lmms",
  },
  {
    id: "Previewed",
    name: "Previewed.app",
    description: "Create mockups and previews",
    url: "https://previewed.app/",
    category: "Creative",
    icon: "placeholder_icon_previewed",
  },

  // Development & DIY Tools
  {
    id: "NevonProjects",
    name: "Nevon Projects",
    description: "DIY projects and tutorials",
    url: "https://nevonprojects.com/",
    category: "Development",
    icon: "placeholder_icon_nevon",
  },

  // Research & Learning Tools
  {
    id: "LearnToHack",
    name: "Learn to Hack",
    description: "Educational resource for hacking and security",
    url: "https://www.hacksplaining.com/",
    category: "research",
    icon: "placeholder_icon_hacksplaining",
  },

  // Text Generation Tools
  {
    id: "Speedwrite",
    name: "Speedwrite",
    description: "Automatic text generator",
    url: "https://speedwrite.com/",
    category: "text-generation",
    icon: "placeholder_icon_speedwrite",
  },
  {
    id: "HemingwayEditor",
    name: "Hemingway Editor",
    description: "Improve writing clarity and readability",
    url: "https://hemingwayapp.com/",
    category: "text-generation",
    icon: "placeholder_icon_hemingway",
  },

  // Audio & Speech Tools
  {
    id: "ASoftMurmur",
    name: "A Soft Murmur",
    description: "Ambient sound generator",
    url: "https://asoftmurmur.com/",
    category: "audio",
    icon: "placeholder_icon_softmurmur",
  },
  {
    id: "Uberduck",
    name: "Uberduck",
    description: "Text-to-speech with AI voices",
    url: "https://uberduck.ai/#mode=tts-basic",
    category: "audio",
    icon: "placeholder_icon_uberduck",
  },
  {
    id: "WideoTextToSpeech",
    name: "Free Text to Speech Software (TTS) - by Wideo",
    description: "Free text-to-speech tool",
    url: "https://wideo.co/text-to-speech/",
    category: "audio",
    icon: "placeholder_icon_wideo",
  },
  {
    id: "VocalRemover",
    name: "Vocal Remover and Isolation [AI]",
    description: "AI-powered vocal remover and isolation",
    url: "https://vocalremover.org/",
    category: "audio",
    icon: "placeholder_icon_vocalremover",
  },
  {
    id: "SafeAudioKit",
    name: "Safeaudiokit.com",
    description: "Safest way to process your audio files",
    url: "https://safeaudiokit.com/",
    category: "audio",
    icon: "placeholder_icon_safeaudiokit",
  },
  {
    id: "Boomy",
    name: "Boomy",
    description: "AI music creation for rainy nights lo-fi",
    url: "https://boomy.com/style/wd_lofi/filter/rainy_nights/create",
    category: "audio",
    icon: "placeholder_icon_boomy",
  },

  // Image Generation Tools
  {
    id: "AIImageUpscaler",
    name: "AI Image Upscaler",
    description: "Upscale & enhance photos",
    url: "https://aiimageupscaler.com/",
    category: "image-generation",
    icon: "placeholder_icon_aiimageupscaler",
  },
  {
    id: "GigapixelAI",
    name: "Gigapixel AI",
    description: "Image upscaler online batch free trial",
    url: "https://gigapixelai.com/image-upscaler",
    category: "image-generation",
    icon: "placeholder_icon_gigapixel",
  },

  // Coding Tools
  {
    id: "PentestGPT",
    name: "PentestGPT",
    description: "AI-powered penetration testing assistant",
    url: "https://pentestgpt.ai/setup",
    category: "coding",
    icon: "placeholder_icon_pentestgpt",
  },
  {
    id: "LlamaCoder",
    name: "Llama Coder",
    description: "AI code generator",
    url: "https://llamacoder.together.ai/chats/p1zoMO63mMGXiW4n",
    category: "coding",
    icon: "placeholder_icon_llamacoder",
  },
  {
    id: "Qwen",
    name: "Qwen",
    description: "AI language model",
    url: "https://qwenlm.ai/",
    category: "coding",
    icon: "placeholder_icon_qwen",
  },
  {
    id: "ZooZooVodafone",
    name: "ZooZoo Vodafone",
    description: "Stable Diffusion XL LoRA model",
    url: "https://civitai.com/models/409844/zoozoo-vodafone",
    category: "coding",
    icon: "placeholder_icon_zoozoo",
  },
  {
    id: "GithubActivityGenerator",
    name: "Github Activity Generator",
    description: "Script to generate a rich GitHub contribution graph",
    url: "https://github.com/Shpota/github-activity-generator",
    category: "coding",
    icon: "placeholder_icon_githubactivity",
  },
  {
    id: "Lovable",
    name: "Lovable",
    description: "AI-powered development tool",
    url: "https://lovable.dev/",
    category: "coding",
    icon: "placeholder_icon_lovable",
  },
  {
    id: "A0Dev",
    name: "a0.dev",
    description: "Create mobile apps with AI",
    url: "https://a0.dev/",
    category: "coding",
    icon: "placeholder_icon_a0dev",
  },
  {
    id: "OpenHands",
    name: "Running OpenHands",
    description: "Documentation for running OpenHands",
    url: "https://docs.all-hands.dev/modules/usage/installation",
    category: "coding",
    icon: "placeholder_icon_openhands",
  },

  // UI/UX Design Tools
  {
    id: "ViewportUI",
    name: "Viewport UI",
    description: "UI curated experiences for your inspiration",
    url: "https://viewport-ui.design/",
    category: "UI/UX Design",
    icon: "placeholder_icon_viewportui",
  },
  {
    id: "IbelickLab",
    name: "Lab",
    description: "Experimental design lab",
    url: "https://ibelick.com/lab",
    category: "UI/UX Design",
    icon: "placeholder_icon_ibelick",
  },
  {
    id: "Uiverse",
    name: "Uiverse",
    description: "The largest library of open-source UI elements",
    url: "https://uiverse.io/",
    category: "UI/UX Design",
    icon: "placeholder_icon_uiverse",
  },
  {
    id: "InterfaceIndex",
    name: "Interface Index",
    description: "Collection of B2B, SaaS, and desktop interface elements",
    url: "https://interface-index.com/",
    category: "UI/UX Design",
    icon: "placeholder_icon_interfaceindex",
  },
  {
    id: "DesignSpells",
    name: "Mobile spells · Design Spells",
    description: "Mobile design inspiration",
    url: "https://www.designspells.com/?tag=mobile",
    category: "UI/UX Design",
    icon: "placeholder_icon_designspells",
  },
  {
    id: "CallToInspiration",
    name: "CallToInspiration – Shopping Card",
    description: "Shopping card design inspiration",
    url: "https://calltoinspiration.com/shopping-card",
    category: "UI/UX Design",
    icon: "placeholder_icon_calltoinspiration",
  },
  {
    id: "ViewportUIAndroid",
    name: "Viewport UI - Android",
    description: "UI curated experiences for Android inspiration",
    url: "https://viewport-ui.design/categories/android/page/4/",
    category: "UI/UX Design",
    icon: "placeholder_icon_viewportuiandroid",
  },
  {
    id: "UiverseSwitches",
    name: "371 Toggle switches: CSS & Tailwind",
    description: "Toggle switch designs in CSS & Tailwind",
    url: "https://uiverse.io/switches",
    category: "UI/UX Design",
    icon: "placeholder_icon_uiverseswitches",
  },

  // AI Text Tools
  {
    id: "HumanizeAI",
    name: "Humanize AI",
    description: "Humanize AI-generated text",
    url: "https://www.humanizeai.pro/",
    category: "text-generation",
    icon: "placeholder_icon_humanizeai",
  },
  {
    id: "GPTZero",
    name: "GPTZero",
    description: "Detect AI-generated text",
    url: "https://app.gptzero.me/",
    category: "text-generation",
    icon: "placeholder_icon_gptzero",
  },

  // AI Video Tools
  {
    id: "HailuoAI",
    name: "Hailuo AI",
    description: "Transform ideas to visuals with AI",
    url: "https://hailuoai.video/",
    category: "image-generation", // Could also be video-specific, but fits here for now
    icon: "placeholder_icon_hailuoai",
  },

  // Career Tools
  {
    id: "InterviewCoder",
    name: "interviewcoder.co/help",
    description: "Help for coding interviews",
    url: "https://www.interviewcoder.co/help",
    category: "coding",
    icon: "placeholder_icon_interviewcoder",
  },
  {
    id: "ResumeIO",
    name: "Resume Builder · Resume.io",
    description: "Online resume builder",
    url: "https://resume.io/app/resumes/52725130/edit",
    category: "productivity",
    icon: "placeholder_icon_resumeio",
  },
];
