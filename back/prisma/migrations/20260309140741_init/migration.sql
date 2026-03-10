-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "parent" INTEGER,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "role" INTEGER NOT NULL,
    "permission" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "login" TEXT,
    "nickname" TEXT,
    "internal_note" TEXT,
    "join_date" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_roles" (
    "id" SERIAL NOT NULL,
    "member" INTEGER NOT NULL,
    "role" INTEGER NOT NULL,

    CONSTRAINT "member_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adhesion" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adhesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "manager" INTEGER NOT NULL,
    "discord_message_id" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_members" (
    "id" SERIAL NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "position_id" INTEGER,

    CONSTRAINT "shift_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_positions" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "xp_mult" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "shift_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_assignment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "shift_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "order_index" INTEGER,

    CONSTRAINT "stock_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_item" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "category_id" INTEGER,
    "expected_quantity" INTEGER,
    "missing_quantity" INTEGER,
    "unit" TEXT,
    "is_active" BOOLEAN,

    CONSTRAINT "stock_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "registration_doc_url" TEXT,
    "fiscal_power" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_trip" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "trip_date" DATE NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "purpose" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battlepass_seasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battlepass_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battlepass_tiers" (
    "id" SERIAL NOT NULL,
    "season_id" INTEGER NOT NULL,
    "tier_number" INTEGER NOT NULL,
    "requirement" INTEGER NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "battlepass_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_battlepass_rewards" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "tier_id" INTEGER NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_battlepass_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_login_key" ON "members"("login");

-- CreateIndex
CREATE UNIQUE INDEX "shift_positions_position_key" ON "shift_positions"("position");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_fkey" FOREIGN KEY ("permission") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_member_fkey" FOREIGN KEY ("member") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adhesion" ADD CONSTRAINT "adhesion_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_manager_fkey" FOREIGN KEY ("manager") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "shift_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "stock_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_trip" ADD CONSTRAINT "expense_trip_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_trip" ADD CONSTRAINT "expense_trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battlepass_tiers" ADD CONSTRAINT "battlepass_tiers_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "battlepass_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "battlepass_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "battlepass_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
