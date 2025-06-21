'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Activity, Flight, Hotel, ItineraryItem } from '@/types';

interface ItineraryContextType {
  itinerary: ItineraryItem[];
  addToItinerary: (item: ItineraryItem) => void;
  removeFromItinerary: (id: string) => void;
  clearItinerary: () => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(
  undefined
);

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};

interface ItineraryProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'travel-itinerary';

export const ItineraryProvider: React.FC<ItineraryProviderProps> = ({
  children,
}) => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItinerary = JSON.parse(stored);
        setItinerary(parsedItinerary);
      }
    } catch (error) {
      console.error('Error loading itinerary from localStorage:', error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    } catch (error) {
      console.error('Error saving itinerary to localStorage:', error);
    }
  }, [itinerary, hasHydrated]);

  const addToItinerary = (item: ItineraryItem) => {
    setItinerary((prev) => {
      const exists = prev.some((existingItem) => {
        if (existingItem.type !== item.type) return false;

        if (item.type === 'flight') {
          const existingFlight = existingItem.data as Flight;
          const newFlight = item.data as Flight;
          return (
            existingFlight.uniqueId === newFlight.uniqueId 
          );
        }

        if (item.type === 'hotel') {
          const existingHotel = existingItem.data as Hotel;
          const newHotel = item.data as Hotel;
          return (
            existingHotel.id === newHotel.id ||
            (existingHotel.name === newHotel.name &&
              existingHotel.address === newHotel.address &&
              existingHotel.checkIn === newHotel.checkIn)
          );
        }

        if (item.type === 'activity') {
          const existingActivity = existingItem.data as Activity;
          const newActivity = item.data as Activity;
          return (
            existingActivity.id === newActivity.id ||
            (existingActivity.name === newActivity.name &&
              existingActivity.location === newActivity.location)
          );
        }

        return false;
      });

      if (exists) {
        toast({
          title: 'Already Added! 🔄',
          description: 'This item is already in your itinerary.',
          duration: 3000,
        });
        return prev;
      }

      return [...prev, item];
    });
  };

  const removeFromItinerary = (id: string) => {
    setItinerary((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);

      if (itemToRemove) {
        const data = itemToRemove.data as any;
        let itemName = '';
        let emoji = '';

        if (itemToRemove.type === 'flight') {
          itemName = `${data.airline} ${data.flightNumber}`;
          emoji = '✈️';
        } else if (itemToRemove.type === 'hotel') {
          itemName = data.name;
          emoji = '🏨';
        } else if (itemToRemove.type === 'activity') {
          itemName = data.name;
          emoji = '🎯';
        }

        toast({
          title: `${itemToRemove.type.charAt(0).toUpperCase() + itemToRemove.type.slice(1)} Removed! ${emoji}`,
          description: `${itemName} has been removed from your itinerary.`,
          duration: 3000,
        });
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const clearItinerary = () => {
    setItinerary([]);
    toast({
      title: 'Itinerary Cleared! 🗑️',
      description: 'All items have been removed from your itinerary.',
      duration: 3000,
    });
  };

  if (!hasHydrated) return null;

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        addToItinerary,
        removeFromItinerary,
        clearItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};