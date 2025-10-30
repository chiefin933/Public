import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { title, description, price, location, type, amenities, images } = req.body;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        type,
        amenities,
        images,
        ownerId,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Error creating property" });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Error fetching properties" });
  }
};

export const getMyProperties = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const properties = await prisma.property.findMany({
      where: {
        ownerId,
      },
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

    res.json(properties);
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    res.status(500).json({ error: "Error fetching properties" });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, type, amenities, images } = req.body;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify ownership
    const existing = await prisma.property.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Property not found or unauthorized" });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        type,
        amenities,
        images,
      },
    });

    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Error updating property" });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify ownership
    const existing = await prisma.property.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Property not found or unauthorized" });
    }

    await prisma.property.delete({
      where: { id },
    });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Error deleting property" });
  }
};