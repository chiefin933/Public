import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, propertyId, flightId, vehicleId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Calculate total price based on booking type
    let totalPrice = 0;
    
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      });
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      totalPrice = property.price * days;
    } else if (flightId) {
      const flight = await prisma.flight.findUnique({
        where: { id: flightId },
      });
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }
      totalPrice = flight.price;
    } else if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      totalPrice = vehicle.price * days;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        propertyId,
        flightId,
        vehicleId,
      },
      include: {
        property: true,
        flight: true,
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Error creating booking" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        property: true,
        flight: true,
        vehicle: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only allow property owners or the booking user to update status
    if (
      booking.userId !== userId &&
      booking.property?.ownerId !== userId
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        property: true,
        flight: true,
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Error updating booking" });
  }
};