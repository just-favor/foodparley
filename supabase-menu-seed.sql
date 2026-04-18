-- Run this in Supabase SQL Editor

create table menu_items (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text not null,
  available boolean default true
);

alter table menu_items enable row level security;
create policy "allow read menu" on menu_items for select using (true);
create policy "allow all admin" on menu_items for all using (true);

insert into menu_items (id, name, description, price, image, category) values
('1','Classic Burger','Juicy beef patty, fresh lettuce, tomato, cheese, special sauce',18200,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&fit=crop&auto=format','Food'),
('2','Margherita Pizza','Fresh mozzarella, basil, tomato sauce on thin crust',20950,'https://i.pinimg.com/736x/42/cf/f1/42cff1d78879f3c692a44ccc24f2dab3.jpg','Food'),
('3','Coke Zero','Classic cola taste, zero sugar and calories',4200,'https://i.pinimg.com/736x/e0/59/1d/e0591dab013166dcb7a727360882acb9.jpg','Drink'),
('4','French Fries','Crispy golden fries, seasoned perfectly',6950,'https://i.pinimg.com/736x/97/9a/96/979a964e971762b6624bd40db88decd6.jpg','Snack'),
('5','Grilled Chicken','Tender grilled chicken breast with herbs',16800,'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&fit=crop&auto=format','Food'),
('6','Lemonade','Fresh squeezed lemonade, refreshing',4900,'https://i.pinimg.com/1200x/49/60/39/4960391468676d4c1a754e80df266997.jpg','Drink'),
('7','Potato Chips','Crunchy salted potato chips',2800,'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&fit=crop&auto=format','Snack'),
('8','Pasta Carbonara','Creamy pasta with bacon and parmesan',19600,'https://i.pinimg.com/1200x/ca/14/19/ca14195fb7f99eacc8d59de8114a5556.jpg','Food'),
('9','Iced Tea','Refreshing iced tea with lemon',3900,'https://i.pinimg.com/1200x/78/89/1f/78891fc2cb818ae8a5b88e2d9b3f710c.jpg','Drink'),
('10','Chocolate Bar','Rich milk chocolate bar',3500,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&fit=crop&auto=format','Snack'),
('11','Beef Tacos','Seasoned beef, salsa, cheese in crispy shells',14000,'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&fit=crop&auto=format','Food'),
('12','Orange Juice','Freshly squeezed orange juice',5600,'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&fit=crop&auto=format','Drink'),
('13','Chicken Shawarma','Marinated chicken, garlic sauce, pickles in pita',15400,'https://i.pinimg.com/1200x/80/c8/c6/80c8c60ea7a54c4d6479b970bbddded2.jpg','Food'),
('14','Mango Smoothie','Creamy mango blended with yogurt and milk',6950,'https://i.pinimg.com/736x/ec/4e/48/ec4e48385346fd49000715b31b2d1e4b.jpg','Drink'),
('15','Onion Rings','Crispy battered onion rings with dipping sauce',7700,'https://i.pinimg.com/736x/b3/f1/c3/b3f1c372014d031872195ffc01342722.jpg','Snack'),
('16','Sushi Roll','Fresh salmon and avocado California roll',22400,'https://i.pinimg.com/736x/26/eb/68/26eb68da59da6326f05522daf8987044.jpg','Food'),
('17','Green Tea','Premium Japanese green tea, hot or iced',3500,'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format','Drink'),
('18','Mixed Nuts','Roasted almonds, cashews, peanuts, no salt',5600,'https://i.pinimg.com/1200x/69/2e/67/692e670fd16e4e80d38098b95139d5bc.jpg','Snack'),
('19','Caesar Salad','Romaine, grilled chicken, croutons, dressing',16100,'https://i.pinimg.com/236x/77/82/8a/77828a0bc6c88f203953efd16dbac859.jpg','Food'),
('20','Espresso','Strong Italian espresso shot',4200,'https://images.unsplash.com/photo-1494314671902-399b18174975?w=400&fit=crop&auto=format','Drink'),
('21','Veggie Spring Rolls','Fresh vegetables wrapped in crispy rolls',9800,'https://i.pinimg.com/1200x/cf/4d/81/cf4d8152ed7184adbd029d3f1dc6f13c.jpg','Snack'),
('22','Falafel Wrap','Crispy falafel, tahini, veggies in wrap',13300,'https://i.pinimg.com/736x/5e/76/19/5e7619e1639dd8878fbe15accce11176.jpg','Food'),
('23','Berry Smoothie','Mixed berries, banana, almond milk blend',7700,'https://i.pinimg.com/1200x/32/a0/ee/32a0ee28322bcc3d55122572284aac98.jpg','Drink'),
('24','Popcorn','Buttered movie-style popcorn',4600,'https://i.pinimg.com/736x/06/20/1d/06201ddf78c4a4bacb195a90acde4d3a.jpg','Snack'),
('25','Steak Dinner','Grilled ribeye steak with mashed potatoes',34950,'https://i.pinimg.com/1200x/b0/d1/0d/b0d10dc5065f2315a1cd33865405bce9.jpg','Food'),
('26','Coffee Latte','Smooth latte with steamed milk and foam',6300,'https://i.pinimg.com/736x/21/74/32/2174329b8ef1603c1cbc68bd9ef5865a.jpg','Drink'),
('27','Cheese Sticks','Mozzarella sticks with marinara dip',9100,'https://i.pinimg.com/736x/a5/8a/97/a58a9704e7dbfa0f62b027911cd49e25.jpg','Snack'),
('28','Pad Thai','Stir-fried noodles with shrimp and peanuts',20300,'https://i.pinimg.com/1200x/b9/20/57/b9205787ecff0e0777167c5fe6af3d31.jpg','Food'),
('29','Milkshake','Vanilla milkshake with whipped cream',8400,'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&fit=crop&auto=format','Drink'),
('30','Pretzels','Soft salted pretzels with mustard',6000,'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&fit=crop&auto=format','Snack');
