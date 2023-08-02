// src/controllers/userController.ts
import { Request, Response } from 'express';
import connectDB from '../config/connectDatabase';
import { STATUS_ENUM, UserEntity } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Not } from 'typeorm';
import { generateCSV } from '../utils/helper';

// Signup function
export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, gender, phone, date } = req.body;

    // Check if user already exists
    const userRepository = connectDB.getRepository(UserEntity);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = 'avatar-1690737863706.jpeg';

    // Create a new user
    const newUser = userRepository.create({ name, email, password: hashedPassword, gender, phone, profilePic, date });
    await userRepository.save(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Login function
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const userRepository = connectDB.getRepository(UserEntity);
    const user = await userRepository.findOne({ select: ['id', 'name', 'email', 'password', 'status'], where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === STATUS_ENUM.PENDING) {
      return res.status(406).json({ message: 'Your account is in pending state!' });
    } else if (user.status === STATUS_ENUM.DEACTIVE) {
      return res.status(406).json({ message: 'Your account has been deactivated!' });
    }

    const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, `${process.env.SECERET_KEY}`, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });

    return res.json({ token });
  } catch (error) {
    console.error('Error during login: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Get user profile function
export async function getUserProfile(req: Request, res: Response) {
  try {
    const userRepository = connectDB.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id: req.user?.userId } });
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error during fetching user profile: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Update user profile
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const userId = req.params?.id
    const userRepository = connectDB.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
    }

    const updated = await userRepository.update({ id: req.user?.userId }, {
      name: req.body?.name ? req.body?.name : user?.name,
      email: req.body?.email ? req.body?.email : user?.email,
      password: req.body?.password ? await bcrypt.hash(req.body?.password, 10) : user?.password,
      phone: req.body?.phone ? req.body?.phone : user?.phone,
      date: req.body?.date ? req.body?.date : user?.date,
      gender: req.body?.gender ? req.body?.gender : user?.gender,
      profilePic: req.file?.filename ? req.file?.filename : user?.profilePic
    });

    return res.status(200).json({ success: updated?.affected, message: 'User profile updated' })
  } catch (error) {
    console.error('Error during updating user profile: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Deactivate user account
export async function deactivateAccount(req: Request, res: Response) {
  try {
    const userRepository = connectDB.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id: req.user?.userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
    }

    const deactivated = await userRepository.update({ id: req.user?.userId }, {
      status: STATUS_ENUM.DEACTIVE
    });

    return res.status(200).json({ success: deactivated?.affected, message: 'Your profile deativated successfully' })
  } catch (error) {
    console.error('Error during updating user profile: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Delete user account
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.params?.id;
    const userRepository = connectDB.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id:userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }

    const deactivated = await userRepository.softDelete({ id: user?.id });

    return res.status(200).json({ success: deactivated?.affected, message: 'Your profile deleted successfully' })
  } catch (error) {
    console.error('Error during deleting user profile: ', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


// Function to download csv
export const downloadCSV = async (req: Request, res: Response) => {
  try {
    const userRepository = connectDB.getRepository(UserEntity);
    const users = userRepository.find({});
    await generateCSV(users);
    res.download('users.csv', 'users.csv', (err) => {
      if (err) {
        console.error('Error downloading CSV file:', err);
      } else {
        console.log('CSV file download successful');
      }
    });
  } catch (error) {
    console.error('Error generating CSV file:', error);
    res.status(500).send('Error generating CSV file');
  }
}

// Pagination helper function
const paginateResults = (page: number, limit: number, total: number, data: any[], search: string | undefined, sortBy: string) => {
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;

  const results = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalCount: total,
    search,
    sortBy,
    data
    // data.slice(startIndex, endIndex),
  };

  return results;
};

// Endpoint for fetching users with pagination, search, and sort filters
export const getUsers = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 2, search = '', sortBy = '' } = req.query;
    page = parseInt(page as string) || 1;
    limit = parseInt(limit as string) || 10;
    const userRepository = connectDB.getRepository(UserEntity);

    // Query builder for filtering and sorting
    const queryBuilder = userRepository.createQueryBuilder('user');

    // Search filter
    if (search) {
      queryBuilder.where('user.name LIKE :search OR user.email LIKE :search OR user.phone LIKE :search OR user.status LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Sort filter
    if (sortBy) {
      // const [sortBy, sortOrder] = sort.split(':');
      queryBuilder.orderBy(`user.${sortBy}`, 'ASC');
    }

    // Count total number of users before pagination
    const totalUsers = await queryBuilder.getCount();
    // Apply pagination and execute the query
    const users = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();


    // Return the paginated and filtered results
    const paginatedUsers = paginateResults(+page, +limit, totalUsers, users, `${search}`, `${sortBy}`);

    res.render('users', { users: paginatedUsers });
    // res.status(200).json(paginatedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

