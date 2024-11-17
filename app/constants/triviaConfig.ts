export const TriviaConfig = {
    startDate: new Date("2024-11-17T00:00:00Z"),
    endDate: new Date("2021-10-31T23:59:59Z"),
    dailyTriviaPoints: 1000,
    questionsAndAnswers: [
        {
            question: "Who was the first person to use Bitcoin?",
            options: ["Satoshi Nakamoto", "Hal Finney", "Nick Szabo", "Wei Dai"],
            answer: "Hal Finney"
        },
        {
            question: "What is the name of the first cryptocurrency?",
            options: ["Bitcoin", "Ethereum", "Ripple", "Litecoin"],
            answer: "Bitcoin"
        },
        {
            question: "Who is the founder of Ethereum?",
            options: ["Vitalik Buterin", "Charles Hoskinson", "Gavin Wood", "Joseph Lubin"],
            answer: "Vitalik Buterin"
        },
        // generate 10 more questions, answers and options 
        {
            question: "In what year was Bitcoin created?",
            options: ["2008", "2009", "2010", "2011"],
            answer: "2008"
        }
    ]
}