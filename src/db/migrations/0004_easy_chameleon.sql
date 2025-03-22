CREATE INDEX "rental_user_idx" ON "rentals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rental_car_idx" ON "rentals" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");