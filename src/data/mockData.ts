// Mock data for development
export const mockQuizzes = [
  {
    id: '1',
    title: 'Cloud Computing Fundamentals',
    description: 'Test your knowledge on cloud computing basics',
    questionCount: 10,
    timeLimit: 15,
    totalMarks: 100,
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'AWS Services Overview',
    description: 'Comprehensive quiz on AWS services',
    questionCount: 15,
    timeLimit: 20,
    totalMarks: 150,
    isActive: true,
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    title: 'Kubernetes Essentials',
    description: 'Master the basics of container orchestration',
    questionCount: 12,
    timeLimit: 18,
    totalMarks: 120,
    isActive: true,
    createdAt: '2024-01-17',
  },
];

export const mockQuestions = [
  {
    id: '1',
    quizId: '1',
    text: 'What is the primary advantage of cloud computing?',
    options: [
      'Lower initial capital investment',
      'Guaranteed 100% uptime',
      'No need for security measures',
      'Slower data processing',
    ],
    correctOption: 0,
    marks: 10,
  },
  {
    id: '2',
    quizId: '1',
    text: 'Which of the following is a characteristic of SaaS?',
    options: [
      'User manages infrastructure',
      'Software is hosted in the cloud',
      'Requires local installation',
      'Limited to on-premise deployment',
    ],
    correctOption: 1,
    marks: 10,
  },
  {
    id: '3',
    quizId: '1',
    text: 'What does IaaS stand for?',
    options: [
      'Information as a Service',
      'Infrastructure as a Service',
      'Internet as a Service',
      'Integration as a Service',
    ],
    correctOption: 1,
    marks: 10,
  },
];

export const mockUser = {
  id: '1',
  email: 'student@example.com',
  name: 'John Doe',
  role: 'student' as const,
  createdAt: '2024-01-01',
};

export const mockAdminUser = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  createdAt: '2024-01-01',
};
