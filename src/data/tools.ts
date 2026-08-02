export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const categories: Category[] = [
  {
    id: "text-generation",
    name: "Text Generation",
    description: "Tools that generate and refine human-like text",
    icon: "PenLine",
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Tools that create and enhance images from text",
    icon: "Image",
  },
  {
    id: "coding",
    name: "Coding",
    description: "AI assistants for writing, debugging, and understanding code",
    icon: "Code",
  },
  {
    id: "audio",
    name: "Audio & Speech",
    description: "Tools for creating and manipulating audio content",
    icon: "Mic",
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Tools to boost workflow efficiency and productivity",
    icon: "Zap",
  },
  {
    id: "research",
    name: "Research & Learning",
    description: "Tools for information gathering and skill development",
    icon: "BookOpen",
  },
  {
    id: "file-sharing",
    name: "File Sharing",
    description: "Secure and private file transfer solutions",
    icon: "Share2",
  },
  {
    id: "software-downloads",
    name: "Software Downloads",
    description: "Platforms for downloading software and applications",
    icon: "Download",
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    description: "Tools for online privacy, security, and account management",
    icon: "Shield",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    description: "Design inspiration and UI component libraries",
    icon: "Palette",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Creative tools for design, mockups, and media",
    icon: "Sparkles",
  },
];

export const tools: Tool[] = [
  // File Sharing
  {
    id: "ToffeeShare",
    name: "ToffeeShare",
    description: "Private & secure file transfer without size limit",
    url: "https://toffeeshare.com/",
    category: "file-sharing",
    icon: "Share2",
  },

  // Productivity
  {
    id: "NeverInstall",
    name: "Never Install",
    description: "Cloud-based application access without local installation",
    url: "https://neverinstall.com/en-GB?ref=betalist",
    category: "productivity",
    icon: "Cloud",
  },
  {
    id: "ResumeIO",
    name: "Resume Builder · Resume.io",
    description: "Online resume builder for professional CVs",
    url: "https://resume.io/app/resumes/52725130/edit",
    category: "productivity",
    icon: "FileText",
  },
  {
    id: "HiddenTools",
    name: "Hidden Tools",
    description: "Discover a curated collection of useful web tools",
    url: "https://hiddentools.dev/",
    category: "productivity",
    icon: "Zap",
  },

  // Software Downloads
  {
    id: "FileCR",
    name: "FileCR",
    description: "The biggest software store with a vast collection",
    url: "https://filecr.com/en/?id=94415884416",
    category: "software-downloads",
    icon: "Download",
  },
  {
    id: "4DOWNLOAD",
    name: "4DOWNLOAD",
    description: "Software download platform with diverse applications",
    url: "https://4download.net/index.php",
    category: "software-downloads",
    icon: "Download",
  },
  {
    id: "FreeSoftwareFiles",
    name: "Free Software Files",
    description: "Latest PC software reviews and free downloads",
    url: "https://www.freesoftwarefiles.com/",
    category: "software-downloads",
    icon: "Download",
  },
  {
    id: "ALLPCWorld",
    name: "ALL PC World",
    description: "Free apps one click away for Windows",
    url: "https://allpcworld.com/",
    category: "software-downloads",
    icon: "Download",
  },

  // Privacy & Security
  {
    id: "JustDeleteMe",
    name: "Just Delete Me",
    description: "Directory of direct links to delete accounts from web services",
    url: "https://justdeleteme.xyz/",
    category: "privacy",
    icon: "Shield",
  },

  // Audio & Speech
  {
    id: "LMMS",
    name: "LMMS",
    description: "Open-source digital audio workstation for music production",
    url: "https://lmms.io/",
    category: "audio",
    icon: "Music",
  },
  {
    id: "ASoftMurmur",
    name: "A Soft Murmur",
    description: "Ambient sound generator for focus and relaxation",
    url: "https://asoftmurmur.com/",
    category: "audio",
    icon: "Volume2",
  },
  {
    id: "Uberduck",
    name: "Uberduck",
    description: "Text-to-speech with thousands of AI voices",
    url: "https://uberduck.ai/#mode=tts-basic",
    category: "audio",
    icon: "Mic",
  },
  {
    id: "WideoTextToSpeech",
    name: "Free Text to Speech by Wideo",
    description: "Free text-to-speech tool for voiceovers",
    url: "https://wideo.co/text-to-speech/",
    category: "audio",
    icon: "Volume2",
  },
  {
    id: "VocalRemover",
    name: "Vocal Remover and Isolation [AI]",
    description: "AI-powered vocal remover and audio isolation",
    url: "https://vocalremover.org/",
    category: "audio",
    icon: "Mic2",
  },
  {
    id: "SafeAudioKit",
    name: "Safeaudiokit.com",
    description: "Privacy-first audio file processing",
    url: "https://safeaudiokit.com/",
    category: "audio",
    icon: "Shield",
  },
  {
    id: "Boomy",
    name: "Boomy",
    description: "AI music creation with curated style presets",
    url: "https://boomy.com/style/wd_lofi/filter/rainy_nights/create",
    category: "audio",
    icon: "Music4",
  },

  // Image Generation
  {
    id: "AIImageUpscaler",
    name: "AI Image Upscaler",
    description: "Upscale and enhance photos with AI",
    url: "https://aiimageupscaler.com/",
    category: "image-generation",
    icon: "ImageUp",
  },
  {
    id: "GigapixelAI",
    name: "Gigapixel AI",
    description: "Online image upscaler with batch processing",
    url: "https://gigapixelai.com/image-upscaler",
    category: "image-generation",
    icon: "ImageUp",
  },
  {
    id: "ZooZooVodafone",
    name: "ZooZoo Vodafone LoRA",
    description: "Stable Diffusion XL LoRA model on Civitai",
    url: "https://civitai.com/models/409844/zoozoo-vodafone",
    category: "image-generation",
    icon: "Image",
  },
  {
    id: "HailuoAI",
    name: "Hailuo AI",
    description: "Transform ideas to visuals with AI video generation",
    url: "https://hailuoai.video/",
    category: "image-generation",
    icon: "Video",
  },

  // Text Generation
  {
    id: "Speedwrite",
    name: "Speedwrite",
    description: "Automatic text generation for rapid content creation",
    url: "https://speedwrite.com/",
    category: "text-generation",
    icon: "PenLine",
  },
  {
    id: "HemingwayEditor",
    name: "Hemingway Editor",
    description: "Improve writing clarity, readability, and style",
    url: "https://hemingwayapp.com/",
    category: "text-generation",
    icon: "PenTool",
  },
  {
    id: "HumanizeAI",
    name: "Humanize AI",
    description: "Humanize AI-generated text for natural readability",
    url: "https://www.humanizeai.pro/",
    category: "text-generation",
    icon: "PenLine",
  },
  {
    id: "GPTZero",
    name: "GPTZero",
    description: "Detect AI-generated text with accuracy",
    url: "https://app.gptzero.me/",
    category: "text-generation",
    icon: "SearchCheck",
  },
  {
    id: "Qwen",
    name: "Qwen",
    description: "Advanced AI language model for various tasks",
    url: "https://qwenlm.ai/",
    category: "text-generation",
    icon: "Brain",
  },

  // Coding
  {
    id: "PentestGPT",
    name: "PentestGPT",
    description: "AI-powered penetration testing assistant",
    url: "https://pentestgpt.ai/setup",
    category: "coding",
    icon: "Shield",
  },
  {
    id: "LlamaCoder",
    name: "Llama Coder",
    description: "AI code generator using Llama models",
    url: "https://llamacoder.together.ai/chats/p1zoMO63mMGXiW4n",
    category: "coding",
    icon: "Code",
  },
  {
    id: "GithubActivityGenerator",
    name: "GitHub Activity Generator",
    description: "Script to generate a rich GitHub contribution graph",
    url: "https://github.com/Shpota/github-activity-generator",
    category: "coding",
    icon: "GitCommitHorizontal",
  },
  {
    id: "Lovable",
    name: "Lovable",
    description: "AI-powered full-stack development platform",
    url: "https://lovable.dev/",
    category: "coding",
    icon: "Code",
  },
  {
    id: "A0Dev",
    name: "a0.dev",
    description: "Create mobile apps with AI assistance",
    url: "https://a0.dev/",
    category: "coding",
    icon: "Smartphone",
  },
  {
    id: "OpenHands",
    name: "Running OpenHands",
    description: "Open-source AI coding agent platform",
    url: "https://docs.all-hands.dev/modules/usage/installation",
    category: "coding",
    icon: "Code",
  },
  {
    id: "InterviewCoder",
    name: "interviewcoder.co",
    description: "Help and resources for coding interviews",
    url: "https://www.interviewcoder.co/help",
    category: "coding",
    icon: "Brain",
  },

  // Creative
  {
    id: "Previewed",
    name: "Previewed.app",
    description: "Create professional mockups and product previews",
    url: "https://previewed.app/",
    category: "creative",
    icon: "Sparkles",
  },

  // Research & Learning
  {
    id: "LearnToHack",
    name: "Hacksplaining",
    description: "Interactive security and hacking education",
    url: "https://www.hacksplaining.com/",
    category: "research",
    icon: "BookOpen",
  },
  {
    id: "NevonProjects",
    name: "Nevon Projects",
    description: "DIY projects, tutorials, and engineering ideas",
    url: "https://nevonprojects.com/",
    category: "research",
    icon: "BookOpen",
  },

  // UI/UX Design
  {
    id: "ViewportUI",
    name: "Viewport UI",
    description: "Curated UI experiences for design inspiration",
    url: "https://viewport-ui.design/",
    category: "ui-ux-design",
    icon: "Palette",
  },
  {
    id: "IbelickLab",
    name: "Lab by Ibelick",
    description: "Experimental design lab with creative UI demos",
    url: "https://ibelick.com/lab",
    category: "ui-ux-design",
    icon: "FlaskConical",
  },
  {
    id: "Uiverse",
    name: "Uiverse",
    description: "The largest library of open-source UI elements",
    url: "https://uiverse.io/",
    category: "ui-ux-design",
    icon: "Component",
  },
  {
    id: "InterfaceIndex",
    name: "Interface Index",
    description: "Collection of B2B, SaaS, and desktop interface patterns",
    url: "https://interface-index.com/",
    category: "ui-ux-design",
    icon: "LayoutDashboard",
  },
  {
    id: "DesignSpells",
    name: "Design Spells",
    description: "Mobile design inspiration and UI patterns",
    url: "https://www.designspells.com/?tag=mobile",
    category: "ui-ux-design",
    icon: "Smartphone",
  },
  {
    id: "CallToInspiration",
    name: "Call To Inspiration",
    description: "Shopping card and e-commerce design inspiration",
    url: "https://calltoinspiration.com/shopping-card",
    category: "ui-ux-design",
    icon: "ShoppingCart",
  },
  {
    id: "ViewportUIAndroid",
    name: "Viewport UI - Android",
    description: "Android-specific UI design inspiration",
    url: "https://viewport-ui.design/categories/android/page/4/",
    category: "ui-ux-design",
    icon: "Palette",
  },
  {
    id: "UiverseSwitches",
    name: "CSS Toggle Switches",
    description: "371 toggle switch designs in CSS & Tailwind",
    url: "https://uiverse.io/switches",
    category: "ui-ux-design",
    icon: "ToggleLeft",
  },
];
