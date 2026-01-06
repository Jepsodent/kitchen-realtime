create table public.menus (
  id serial not null,
  name text,
  description text,
  price numeric,
  discount numeric,
  image_url text,
  category text,
  is_available boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.menus enable row level

-- INSERT INTO VALUES
INSERT INTO public.menus (name, description, price, discount, image_url, category, is_available)
VALUES
('Nasi Goreng Kampung', 'Nasi goreng tradisional dengan ayam suwir, telur mata sapi, dan acar segar.', 25000, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm683zbJbBtvA5kHNfGT_JJ-oOGt6D57QOBA&s', 'Main Course', true),
('Beef Smash Burger', 'Burger daging sapi premium dengan keju cheddar leleh, selada, dan saus spesial.', 45000, 5000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjgCW8wNzODuoLV_bb6F5P-WCbB6_rQ-b6qg&s', 'Main Course', true),
('Matcha Latte', 'Minuman matcha jepang premium dengan susu creamy.', 22000, 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTybVC6wsXxzz3Gjkmk7miRMPR2LoJAhKYE2A&s', 'Beverage', true),
('Mineral Water', 'Air mineral botol 600ml.', 5000, 0, 'https://img.id.my-best.com/product_images/51294a9382b9ef098e3a03bf13a59526.jpeg?ixlib=rails-4.3.1&q=70&lossless=0&w=800&h=800&fit=clip&s=1992e4238c4c98f80071ebfaf4463ce3', 'Beverage', true),
('French Fries', 'Kentang goreng renyah dengan taburan parsley.', 15000, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4io_MUgpchreRk8HSYrLqPsBomSuXhzX57w&s', 'Snack', true)
