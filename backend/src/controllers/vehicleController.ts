import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { make, model, year, type, price, location, images } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year: parseInt(year),
        type,
        price: parseFloat(price),
        location,
        images,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ error: "Error creating vehicle" });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const { location, type, minPrice, maxPrice, available } = req.query;

    const where: any = {};

    if (location) where.location = location;
    if (type) where.type = type;
    if (available === "true") where.available = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: {
        price: "asc",
      },
    });

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Error fetching vehicle" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { make, model, year, type, price, location, available, images } =
      req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        make,
        model,
        year: parseInt(year),
        type,
        price: parseFloat(price),
        location,
        available: available === "true",
        images,
      },
    });

    res.json(vehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Error updating vehicle" });
  }
};