export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Food' | 'Drink' | 'Snack';
}

// Items now live in Supabase — fallback is empty
export const menuItems: MenuItem[] = [];

/* HARDCODED FALLBACK — uncomment if Supabase is unavailable
export const menuItems: MenuItem[] = [
  { id: '1', name: 'Classic Burger', description: 'Juicy beef patty, fresh lettuce, tomato, cheese, special sauce', price: 18200, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&fit=crop&auto=format', category: 'Food' },
  { id: '2', name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato sauce on thin crust', price: 20950, image: 'https://i.pinimg.com/736x/42/cf/f1/42cff1d78879f3c692a44ccc24f2dab3.jpg', category: 'Food' },
  { id: '3', name: 'Coke Zero', description: 'Classic cola taste, zero sugar and calories', price: 4200, image: 'https://i.pinimg.com/736x/e0/59/1d/e0591dab013166dcb7a727360882acb9.jpg', category: 'Drink' },
  { id: '4', name: 'French Fries', description: 'Crispy golden fries, seasoned perfectly', price: 6950, image: 'https://i.pinimg.com/736x/97/9a/96/979a964e971762b6624bd40db88decd6.jpg', category: 'Snack' },
  { id: '5', name: 'Grilled Chicken', description: 'Tender grilled chicken breast with herbs', price: 16800, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&fit=crop&auto=format', category: 'Food' },
  { id: '6', name: 'Lemonade', description: 'Fresh squeezed lemonade, refreshing', price: 4900, image: 'https://i.pinimg.com/1200x/49/60/39/4960391468676d4c1a754e80df266997.jpg', category: 'Drink' },
  { id: '7', name: 'Potato Chips', description: 'Crunchy salted potato chips', price: 2800, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop&auto=format', category: 'Snack' },
  { id: '8', name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and parmesan', price: 19600, image: 'https://i.pinimg.com/1200x/ca/14/19/ca14195fb7f99eacc8d59de8114a5556.jpg', category: 'Food' },
  { id: '9', name: 'Iced Tea', description: 'Refreshing iced tea with lemon', price: 3900, image: 'https://i.pinimg.com/1200x/78/89/1f/78891fc2cb818ae8a5b88e2d9b3f710c.jpg', category: 'Drink' },
  { id: '10', name: 'Chocolate Bar', description: 'Rich milk chocolate bar', price: 3500, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&fit=crop&auto=format', category: 'Snack' },
  { id: '11', name: 'Beef Tacos', description: 'Seasoned beef, salsa, cheese in crispy shells', price: 14000, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&fit=crop&auto=format', category: 'Food' },
  { id: '12', name: 'Orange Juice', description: 'Freshly squeezed orange juice', price: 5600, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&fit=crop&auto=format', category: 'Drink' },
  { id: '13', name: 'Chicken Shawarma', description: 'Marinated chicken, garlic sauce, pickles in pita', price: 15400, image: 'https://i.pinimg.com/1200x/80/c8/c6/80c8c60ea7a54c4d6479b970bbddded2.jpg', category: 'Food' },
  { id: '14', name: 'Mango Smoothie', description: 'Creamy mango blended with yogurt and milk', price: 6950, image: 'https://i.pinimg.com/736x/ec/4e/48/ec4e48385346fd49000715b31b2d1e4b.jpg', category: 'Drink' },
  { id: '15', name: 'Onion Rings', description: 'Crispy battered onion rings with dipping sauce', price: 7700, image: 'https://i.pinimg.com/736x/b3/f1/c3/b3f1c372014d031872195ffc01342722.jpg', category: 'Snack' },
  { id: '16', name: 'Sushi Roll', description: 'Fresh salmon and avocado California roll', price: 22400, image: 'https://i.pinimg.com/736x/26/eb/68/26eb68da59da6326f05522daf8987044.jpg', category: 'Food' },
  { id: '17', name: 'Green Tea', description: 'Premium Japanese green tea, hot or iced', price: 3500, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format', category: 'Drink' },
  { id: '18', name: 'Mixed Nuts', description: 'Roasted almonds, cashews, peanuts, no salt', price: 5600, image: 'https://i.pinimg.com/1200x/69/2e/67/692e670fd16e4e80d38098b95139d5bc.jpg', category: 'Snack' },
  { id: '19', name: 'Caesar Salad', description: 'Romaine, grilled chicken, croutons, dressing', price: 16100, image: 'https://i.pinimg.com/236x/77/82/8a/77828a0bc6c88f203953efd16dbac859.jpg', category: 'Food' },
  { id: '20', name: 'Espresso', description: 'Strong Italian espresso shot', price: 4200, image: 'https://images.unsplash.com/photo-1494314671902-399b18174975?w=400&fit=crop&auto=format', category: 'Drink' },
  { id: '21', name: 'Veggie Spring Rolls', description: 'Fresh vegetables wrapped in crispy rolls', price: 9800, image: 'https://i.pinimg.com/1200x/cf/4d/81/cf4d8152ed7184adbd029d3f1dc6f13c.jpg', category: 'Snack' },
  { id: '22', name: 'Falafel Wrap', description: 'Crispy falafel, tahini, veggies in wrap', price: 13300, image: 'https://i.pinimg.com/736x/5e/76/19/5e7619e1639dd8878fbe15accce11176.jpg', category: 'Food' },
  { id: '23', name: 'Berry Smoothie', description: 'Mixed berries, banana, almond milk blend', price: 7700, image: 'https://i.pinimg.com/1200x/32/a0/ee/32a0ee28322bcc3d55122572284aac98.jpg', category: 'Drink' },
  { id: '24', name: 'Popcorn', description: 'Buttered movie-style popcorn', price: 4600, image: 'https://i.pinimg.com/736x/06/20/1d/06201ddf78c4a4bacb195a90acde4d3a.jpg', category: 'Snack' },
  { id: '25', name: 'Steak Dinner', description: 'Grilled ribeye steak with mashed potatoes', price: 34950, image: 'https://i.pinimg.com/1200x/b0/d1/0d/b0d10dc5065f2315a1cd33865405bce9.jpg', category: 'Food' },
  { id: '26', name: 'Coffee Latte', description: 'Smooth latte with steamed milk and foam', price: 6300, image: 'https://i.pinimg.com/736x/21/74/32/2174329b8ef1603c1cbc68bd9ef5865a.jpg', category: 'Drink' },
  { id: '27', name: 'Cheese Sticks', description: 'Mozzarella sticks with marinara dip', price: 9100, image: 'https://i.pinimg.com/736x/a5/8a/97/a58a9704e7dbfa0f62b027911cd49e25.jpg', category: 'Snack' },
  { id: '28', name: 'Pad Thai', description: 'Stir-fried noodles with shrimp and peanuts', price: 20300, image: 'https://i.pinimg.com/1200x/b9/20/57/b9205787ecff0e0777167c5fe6af3d31.jpg', category: 'Food' },
  { id: '29', name: 'Milkshake', description: 'Vanilla milkshake with whipped cream', price: 8400, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&fit=crop&auto=format', category: 'Drink' },
  { id: '30', name: 'Pretzels', description: 'Soft salted pretzels with mustard', price: 6000, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&fit=crop&auto=format', category: 'Snack' },
];
*/
