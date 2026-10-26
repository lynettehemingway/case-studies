// Shared content for all three visual versions.
window.cartograph = {
  "title": "CARTograph",
  "description": "I designed a grocery-planning app that helps shoppers compare prices and decide whether another store is worth the drive.",
  "source": "https://lynettehemingway.com/#projects",
  "sections": [
    {
      "id": "problem",
      "title": "Would another store actually save you money?",
      "paragraphs": [
        "That was the question behind CARTograph. A cheaper grocery bill doesn't always mean a cheaper trip, especially if another stop adds time, distance, and gas.",
        "We built a grocery-planning proof of concept for shoppers trying to balance their budget with the time they have. I designed the mobile experience in Figma. My teammates handled engineering, AI, and GIS."
      ],
      "image": "../assets/screens/route.png",
      "imageAlt": "Route options with store stops, distance, travel time, and estimated cost",
      "caption": "Route options put the cost of the trip next to the grocery savings."
    },
    {
      "id": "role",
      "title": "What I worked on",
      "paragraphs": [
        "I mapped the shopping flow and designed the app's screens, icons, buttons, and mascot in Figma. I also came up with the name CARTograph and the slogan, 'chart your cart!'.",
        "My focus was connecting the steps: making a list, comparing prices, picking a route, and heading to the store. I wanted those decisions to feel like parts of one shopping trip."
      ],
      "image": "../assets/screens/original.png",
      "imageAlt": "CARTograph home screen with shopping shortcuts and a map",
      "caption": "The home screen brings the shopping tools and map together."
    },
    {
      "id": "process",
      "title": "Working out the shopping flow",
      "paragraphs": [
        "I reviewed how grocery planning moves between lists, retailer prices, and navigation. The team also explored store and product data through an ArcGIS proof of concept.",
        "A lower price only helps if the extra drive is worth it. That shaped the flow: shoppers should be able to compare the whole trip before choosing a route."
      ],
      "steps": [
        "Create a list or import a recipe",
        "Compare nearby store prices",
        "Review route options",
        "Choose based on savings and travel",
        "Navigate the trip"
      ],
      "image": "../assets/screens/editlist.png",
      "imageAlt": "Editable grocery list with ingredients, quantities, and route-planning controls",
      "caption": "List editing comes before price comparison and route selection."
    },
    {
      "id": "decisions",
      "title": "Bringing meals, lists, and routes together",
      "paragraphs": [
        "I connected recipe import and list building so a meal idea could become a shopping list. The team added Carter, an Azure OpenAI assistant, to help with meal ideas and ingredients.",
        "For route selection, the goal was to show prices alongside travel time, distance, and estimated gas cost. The cheapest product price shouldn't be the only thing a shopper sees.",
        "The app was organized around home, a map of stores and deals, lists, route recommendations, Carter, and shopping preferences."
      ],
      "image": "../assets/screens/mealidea.png",
      "imageAlt": "Carter AI screen for turning meal ideas into ingredients",
      "caption": "Carter helps shoppers move from a meal idea to ingredients."
    },
    {
      "id": "constraints",
      "title": "What we could build in a hackathon",
      "paragraphs": [
        "We couldn't get reliable live grocery prices across retailers, so the proof of concept used a limited service area in Redlands, California.",
        "Licensing prevented the team from publishing the original ArcGIS Pro ModelBuilder workflow as a web tool. They identified another approach using ArcGIS routing services and the Maps SDK.",
        "Emulator setup and connecting the different technologies also took time. We prioritized a complete shopping flow over adding every feature we had discussed."
      ]
    },
    {
      "id": "outcome",
      "title": "The result",
      "paragraphs": [
        "Our team built a functional proof of concept and placed second at the Esri hackathon. It brought grocery planning, product data, geographic analysis, AI assistance, and route optimization into one project.",
        "The award and prototype are the outcomes we can point to. The app hasn't been released as a production product, and live pricing and shopper usability testing aren't established results.",
        "The biggest lesson for me was that a feature can be technically interesting and still make shopping harder. Keeping the experience convenient mattered more than fitting in every idea."
      ],
      "image": "../assets/screens/jack.png",
      "imageAlt": "Profile with dietary preferences, store preferences, and a prototype impact summary",
      "caption": "The profile design includes shopping and dietary preferences. Displayed figures are prototype content."
    },
    {
      "id": "next",
      "title": "What I'd work on next",
      "paragraphs": [
        "The team identified these areas for future development:"
      ],
      "items": [
        "Live grocery prices and traffic",
        "Coverage beyond Redlands",
        "Personalized budgeting and meal planning",
        "Shared savings goals and shopping challenges",
        "A production mobile release"
      ]
    }
  ]
};
