import { Resource } from "@/components/ResourceCard";

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Control Systems Lab Manual",
    subject: "Control Systems",
    department: "Electronics",
    year: 4,
    sem: 7,
    type: "Records",
    views: 823,
    downloads: 478,
    fileSize: "2.4 MB",
    description: "Complete lab manual for Control Systems with circuit diagrams, procedures, and expected outcomes."
  },
  {
    id: "2",
    title: "Engineering Mathematics III Previous Papers",
    subject: "Engineering Mathematics",
    department: "Computer Science",
    year: 2,
    sem: 3,
    type: "Previous Papers",
    views: 1890,
    downloads: 1456,
    fileSize: "3.1 MB",
    description: "Previous year question papers for Engineering Mathematics III with detailed solutions."
  },
  {
    id: "3",
    title: "Database Management Systems Guide",
    subject: "Database Systems",
    department: "Computer Science",
    year: 3,
    sem: 5,
    type: "Notes",
    views: 1567,
    downloads: 1123,
    fileSize: "5.2 MB",
    description: "Complete guide to DBMS covering SQL, normalization, transactions, indexing, and query optimization with examples."
  },
  {
    id: "4",
    title: "Machine Design Lab Observations",
    subject: "Machine Design",
    department: "Mechanical",
    year: 4,
    sem: 7,
    type: "Observations",
    views: 445,
    downloads: 312,
    fileSize: "1.8 MB",
    description: "Lab observation sheets for Machine Design experiments including stress analysis, gear design, and bearing calculations."
  },
  {
    id: "5",
    title: "Data Structures Lecture Notes - Module 1",
    subject: "Data Structures",
    department: "Computer Science",
    year: 2,
    sem: 3,
    type: "Notes",
    views: 2104,
    downloads: 1678,
    fileSize: "2.9 MB",
    description: "Comprehensive lecture notes covering arrays, linked lists, stacks, queues, and basic algorithms."
  },
  {
    id: "6",
    title: "Thermodynamics Previous Year Papers",
    subject: "Thermodynamics",
    department: "Mechanical",
    year: 2,
    sem: 3,
    type: "Previous Papers",
    views: 756,
    downloads: 589,
    fileSize: "1.5 MB",
    description: "Collection of previous year exam papers with solutions for Thermodynamics."
  },
  {
    id: "7",
    title: "Digital Electronics Lab Records",
    subject: "Digital Electronics",
    department: "Electronics",
    year: 3,
    sem: 5,
    type: "Records",
    views: 634,
    downloads: 421,
    fileSize: "3.7 MB",
    description: "Complete lab records with circuit diagrams, truth tables, and observations for digital electronics experiments."
  },
  {
    id: "8",
    title: "Operating Systems Exam Papers 2023",
    subject: "Operating Systems",
    department: "Computer Science",
    year: 3,
    sem: 5,
    type: "Previous Papers",
    views: 1432,
    downloads: 987,
    fileSize: "2.2 MB",
    description: "Previous year question papers from 2023 with answers for Operating Systems."
  },
  {
    id: "9",
    title: "Fluid Mechanics Lab Manual",
    subject: "Fluid Mechanics",
    department: "Civil",
    year: 3,
    sem: 5,
    type: "Records",
    views: 512,
    downloads: 378,
    fileSize: "4.1 MB",
    description: "Lab manual covering fluid properties, flow measurement, and hydraulic experiments."
  },
  {
    id: "10",
    title: "Computer Networks Notes - Complete",
    subject: "Computer Networks",
    department: "Computer Science",
    year: 3,
    sem: 6,
    type: "Notes",
    views: 1823,
    downloads: 1234,
    fileSize: "6.8 MB",
    description: "Complete notes on computer networks including OSI model, TCP/IP, routing protocols, and network security."
  },
  {
    id: "11",
    title: "Strength of Materials Previous Papers",
    subject: "Strength of Materials",
    department: "Civil",
    year: 2,
    sem: 3,
    type: "Previous Papers",
    views: 689,
    downloads: 523,
    fileSize: "2.6 MB",
    description: "Collection of previous papers with detailed solutions for strength of materials."
  },
  {
    id: "12",
    title: "Microprocessors Lab Observations",
    subject: "Microprocessors",
    department: "Electronics",
    year: 3,
    sem: 5,
    type: "Observations",
    views: 578,
    downloads: 401,
    fileSize: "3.2 MB",
    description: "Lab observation sheets for 8085 and 8086 microprocessor experiments with assembly programs."
  }
];

export const departments = ["All", "Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"];
export const years = ["All Years", "Year 1", "Year 2", "Year 3", "Year 4"];
export const resourceTypes = ["All", "Notes", "Previous Papers", "Records", "Observations", "Assignments"];
