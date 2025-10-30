import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFlight = async (req: Request, res: Response) => {
  try {
    const {
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      type,
      seatsAvailable,
    } = req.body;

    const flight = await prisma.flight.create({
      data: {
        flightNumber,
        airline,
        departureCity,
        arrivalCity,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price: parseFloat(price),
        type,
        seatsAvailable: parseInt(seatsAvailable),
      },
    });

    res.status(201).json(flight);
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ error: "Error creating flight" });
  }
};

export const getFlights = async (req: Request, res: Response) => {
  try {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      type,
      minPrice,
      maxPrice,
    } = req.query;

    let where: any = {};

    if (departureCity) where.departureCity = departureCity;
    if (arrivalCity) where.arrivalCity = arrivalCity;
    if (type) where.type = type;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (departureDate) {
      const date = new Date(departureDate as string);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      where.departureTime = {
        gte: date,
        lt: nextDate,
      };
    }

    const flights = await prisma.flight.findMany({
      where,
      orderBy: {
        departureTime: "asc",
      },
    });

    res.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Error fetching flights" });
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flight = await prisma.flight.findUnique({
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

    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    res.json(flight);
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ error: "Error fetching flight" });
  }
};

export const updateFlight = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      type,
      seatsAvailable,
    } = req.body;

    const flight = await prisma.flight.update({
      where: { id },
      data: {
        flightNumber,
        airline,
        departureCity,
        arrivalCity,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price: parseFloat(price),
        type,
        seatsAvailable: parseInt(seatsAvailable),
      },
    });

    res.json(flight);
  } catch (error) {
    console.error("Error updating flight:", error);
    res.status(500).json({ error: "Error updating flight" });
  }
};