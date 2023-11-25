import expressAsyncHandler from 'express-async-handler';
import { Address } from '@prisma/client';
import {
  ApiResponse,
  ORDERED_BY_CREATED_AT,
  getPagination,
  prisma,
} from '@/utils';
import { StatusCodes } from 'http-status-codes';
import { PaginationQuery } from '@/types/interfaces';
import { MessageType } from '@/types/enums';
import { NotFoundError } from '@/error';

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    create new address
 * @route   POST /api/v1/address
 * @access  Private logged in user
 */

interface CreateAddressBody {
  street: Address['street'];
  city: Address['city'];
  state: Address['state'];
  country: Address['country'];
  zip: Address['zip'];
  isDefault: Address['isDefault'];
}
export const createAddress = expressAsyncHandler(async (req, res, next) => {
  const { city, country, isDefault, state, street, zip } = <CreateAddressBody>(
    req.body
  );
  const userId = req.user!.id;
  const address = await prisma.address.create({
    data: {
      city,
      country,
      isDefault,
      state,
      street,
      zip,
      userId,
    },
  });

  if (address.isDefault) {
    await prisma.address.updateMany({
      where: {
        isDefault: true,
        userId,
        id: {
          not: address.id,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  const response = new ApiResponse({
    data: address,
    messages: [
      {
        message: 'Address created successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
  });

  res.status(response.statusCode).json(response);
});
/** ---------------------------------------------------------------------------------- */

/**
 * @desc    update address
 * @route   PUT /api/v1/address
 * @access  Private logged in user
 */
interface UpdateAddressParams {
  id: Address['id'];
}

interface UpdateAddressBody extends Partial<CreateAddressBody> {}

export const updateAddressById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <UpdateAddressParams>(<unknown>req.params);
  const { city, country, isDefault, state, street, zip } = <UpdateAddressBody>(
    req.body
  );
  const userId = req.user!.id;

  const address = await prisma.address.update({
    where: {
      id,
      userId,
    },
    data: {
      city,
      country,
      isDefault,
      state,
      street,
      zip,
    },
  });

  if (!address) {
    throw new NotFoundError([
      { message: 'Address not found', type: MessageType.ERROR },
    ]);
  }

  if (address.isDefault) {
    await prisma.address.updateMany({
      where: {
        isDefault: true,
        userId,
        id: {
          not: address.id,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  const response = new ApiResponse({
    data: address,
    messages: [
      {
        message: 'Address updated successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    delete address
 * @route   DELETE /api/v1/address/:id
 * @access  Private logged in user
 */
interface DeleteAddressParams {
  id: Address['id'];
}

export const deleteAddressById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <DeleteAddressParams>(<unknown>req.params);
  const userId = req.user!.id;

  const address = await prisma.address.update({
    where: {
      id,
      userId,
    },
    data: { active: false },
  });

  if (!address) {
    throw new NotFoundError([
      { message: 'Address not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: address,
    messages: [
      {
        message: 'Address deleted successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    get address by id
 * @route   GET /api/v1/address/:id
 * @access  Private logged in user
 */

interface GetAddressByIdParams {
  id: Address['id'];
}

export const getAddressById = expressAsyncHandler(async (req, res, next) => {
  const { id } = <GetAddressByIdParams>(<unknown>req.params);
  const userId = req.user!.id;

  const address = await prisma.address.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!address) {
    throw new NotFoundError([
      { message: 'Address not found', type: MessageType.ERROR },
    ]);
  }

  const response = new ApiResponse({
    data: address,
    messages: [
      {
        message: 'Address fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    get all addresses
 * @route   GET /api/v1/address
 * @access  Private logged in user
 */

export const getAllAddresses = expressAsyncHandler(async (req, res, next) => {
  let { page, limit, sort } = <PaginationQuery>(<unknown>req.query);

  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;

  const orderBy = ORDERED_BY_CREATED_AT(sort);

  const addresses = await prisma.address.findMany({
    skip,
    take: limit,
    where: { active: true, userId: req.user!.id },
    orderBy,
  });

  const length = addresses.length;
  const total = await prisma.address.count();

  const pagination = getPagination({
    length,
    page,
    limit,
    total,
  });

  const response = new ApiResponse({
    messages: [
      {
        message: 'Addresses fetched successfully',
        type: MessageType.SUCCESS,
      },
    ],
    pagination,
    data: addresses,
  });

  res.status(response.statusCode).json(response);
});
