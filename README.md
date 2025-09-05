# 📚 Interactive Quiz App

A modern, responsive educational quiz platform built with HTML, CSS, and JavaScript. This application provides an engaging way to test knowledge with instant feedback, progress tracking, and detailed explanations.

## 🌟 Features

- **Interactive Quizzes**: Multiple choice questions with instant feedback
- **Progress Tracking**: Real-time score and progress indicators
- **Timer**: Track time spent on each quiz
- **Auto-advance**: Automatic progression through questions
- **Review Mode**: Detailed review of all answers after completion
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Teacher Panel**: Live editing of questions for customization
- **Keyboard Shortcuts**: Navigate with arrow keys and save with Ctrl/Cmd+S
- **Print/PDF Export**: Save results for offline review

## 📁 Project Structure

```
quiz-app/
├── index.html                 # Main navigation page
├── assets/
│   ├── css/
│   │   └── styles.css        # Shared styles and responsive design
│   └── js/
│       └── quiz-engine.js    # Core quiz functionality
├── data/
│   ├── unit2-lesson3-questions.json  # Climate science questions
│   └── unit2-lesson5-questions.json  # Environmental sustainability questions
├── quizzes/
│   ├── unit2-lesson3.html    # Man and Climate quiz
│   └── unit2-lesson5.html    # A Friend of the Earth quiz
└── README.md                 # This documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a web browser
3. **Select** a quiz from the navigation page
4. **Start** answering questions and learning!

### Local Development

For local development, you can use any HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📖 Available Quizzes

### Unit 2, Lesson 3: Man and Climate
- **Topic**: Climate science and human impact
- **Questions**: 50 multiple choice questions
- **Level**: Intermediate
- **Topics Covered**:
  - Greenhouse gases and their effects
  - Fossil fuel consumption
  - Industrial activities and environmental impact
  - Carbon dioxide and climate change

### Unit 2, Lesson 5: A Friend of the Earth
- **Topic**: Environmental sustainability
- **Questions**: 50 multiple choice questions
- **Level**: Beginner
- **Topics Covered**:
  - Reduce, reuse, recycle principles
  - Sustainable consumption
  - Environmental conservation
  - Eco-friendly practices

## 🎮 How to Use

### For Students
1. **Navigate** to the quiz you want to take
2. **Read** each question carefully
3. **Select** your answer from the multiple choice options
4. **Submit** your answer to get instant feedback
5. **Review** your results and explanations at the end
6. **Print or save** your results for future reference

### For Teachers
1. **Open** any quiz page
2. **Scroll down** to the "Teacher Panel" section
3. **Edit** the JSON data to modify questions
4. **Click** "Apply JSON" to update the quiz
5. **Use** Ctrl/Cmd+S to download the modified quiz

## 🛠️ Customization

### Adding New Questions

Questions are stored in JSON format in the `data/` folder. Each question has the following structure:

```json
{
  "id": 1,
  "type": "mcq",
  "points": 1,
  "q": "Your question here?",
  "opts": [
    "Option 1",
    "Option 2", 
    "Option 3",
    "Option 4"
  ],
  "ans": 0,
  "exp": "Explanation of the correct answer"
}
```

### Question Types

- **MCQ**: Multiple Choice Questions
- **TF**: True/False Questions
- **Fill**: Fill-in-the-blank Questions

### Creating New Quizzes

1. **Create** a new JSON file in the `data/` folder
2. **Add** your questions following the JSON structure
3. **Create** a new HTML file in the `quizzes/` folder
4. **Copy** the structure from existing quiz files
5. **Update** the fetch URL to point to your new JSON file
6. **Update** the title and metadata

## 🎨 Styling

The application uses CSS custom properties (variables) for easy theming:

```css
:root {
  --bg: #0f172a;           /* Background color */
  --card: #111827ee;       /* Card background */
  --text: #e5e7eb;         /* Text color */
  --accent: #22c55e;       /* Primary accent */
  --accent-2: #6366f1;     /* Secondary accent */
  --warn: #ef4444;         /* Warning/error color */
  --ok: #10b981;           /* Success color */
}
```

## ⌨️ Keyboard Shortcuts

- **Arrow Right**: Next question
- **Arrow Left**: Previous question
- **Ctrl/Cmd + S**: Download current quiz as HTML file

## 🔧 Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Fetch API for loading JSON data

### Performance
- Lightweight and fast loading
- No external dependencies
- Optimized for mobile devices
- Efficient DOM manipulation

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Compact design with simplified navigation

## 🤝 Contributing

To contribute to this project:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍🏫 Author

**Sharif Uddin** - Educational Content Creator

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure you're using a modern web browser
3. Verify that all files are in the correct directory structure
4. For local development, use an HTTP server (not file:// protocol)

## 🔮 Future Enhancements

- [ ] User authentication and progress tracking
- [ ] More question types (drag-and-drop, matching)
- [ ] Audio support for questions
- [ ] Multi-language support
- [ ] Analytics and reporting
- [ ] Offline support with service workers
- [ ] Integration with learning management systems

---

**Happy Learning! 🎓**
