import { connectDB } from '@/server/config/db';
import Employee from '@/server/models/Employee';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { sapId, password, type } = req.body;
    console.log('Login attempt:', { sapId, password, type });
    
    // Find employee by SAP ID
    const employee = await Employee.findOne({ SAPID: sapId });
    console.log('Found employee:', employee);
    
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For admin login, verify password and role
    if (type === 'admin') {
      const isValidPassword = password === employee.password;
      console.log('Password check:', { 
        input: password, 
        stored: employee.password,
        isValid: isValidPassword,
        role: employee.role
      });
      
      if (!isValidPassword || employee.role !== 'admin') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        sapId: employee.SAPID,
        role: employee.role,
        name: employee.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        sapId: employee.SAPID,
        name: employee.name,
        role: employee.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}