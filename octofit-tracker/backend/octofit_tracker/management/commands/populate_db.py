from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
from bson import ObjectId


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('✓ Cleared existing data'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Assemble! The mightiest heroes of the Marvel Universe'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League - Defenders of truth and justice'
        )
        self.stdout.write(self.style.SUCCESS('✓ Created teams'))
        
        # Create Marvel Users
        self.stdout.write('Creating Marvel heroes...')
        marvel_users = [
            User.objects.create(
                name='Iron Man',
                email='tony.stark@marvel.com',
                password='arc_reactor_3000',
                team='Team Marvel'
            ),
            User.objects.create(
                name='Captain America',
                email='steve.rogers@marvel.com',
                password='shield_forever',
                team='Team Marvel'
            ),
            User.objects.create(
                name='Thor',
                email='thor@asgard.marvel.com',
                password='mjolnir_worthy',
                team='Team Marvel'
            ),
            User.objects.create(
                name='Black Widow',
                email='natasha.romanoff@marvel.com',
                password='red_room_graduate',
                team='Team Marvel'
            ),
            User.objects.create(
                name='Hulk',
                email='bruce.banner@marvel.com',
                password='angry_scientist',
                team='Team Marvel'
            ),
        ]
        
        # Create DC Users
        self.stdout.write('Creating DC heroes...')
        dc_users = [
            User.objects.create(
                name='Superman',
                email='clark.kent@dc.com',
                password='kryptonian_power',
                team='Team DC'
            ),
            User.objects.create(
                name='Batman',
                email='bruce.wayne@dc.com',
                password='dark_knight_rises',
                team='Team DC'
            ),
            User.objects.create(
                name='Wonder Woman',
                email='diana.prince@dc.com',
                password='amazon_warrior',
                team='Team DC'
            ),
            User.objects.create(
                name='The Flash',
                email='barry.allen@dc.com',
                password='speed_force_forever',
                team='Team DC'
            ),
            User.objects.create(
                name='Aquaman',
                email='arthur.curry@dc.com',
                password='atlantis_king',
                team='Team DC'
            ),
        ]
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(all_users)} superhero users'))
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing', 'HIIT']
        activities_data = [
            # Marvel heroes activities
            {'user': marvel_users[0], 'type': 'Weightlifting', 'duration': 60, 'calories': 450, 'distance': None},
            {'user': marvel_users[0], 'type': 'Running', 'duration': 45, 'calories': 550, 'distance': 8.5},
            {'user': marvel_users[1], 'type': 'Running', 'duration': 90, 'calories': 800, 'distance': 15.0},
            {'user': marvel_users[1], 'type': 'Boxing', 'duration': 60, 'calories': 650, 'distance': None},
            {'user': marvel_users[2], 'type': 'Weightlifting', 'duration': 120, 'calories': 900, 'distance': None},
            {'user': marvel_users[2], 'type': 'HIIT', 'duration': 45, 'calories': 600, 'distance': None},
            {'user': marvel_users[3], 'type': 'Yoga', 'duration': 60, 'calories': 350, 'distance': None},
            {'user': marvel_users[3], 'type': 'Running', 'duration': 60, 'calories': 600, 'distance': 10.0},
            {'user': marvel_users[4], 'type': 'Weightlifting', 'duration': 90, 'calories': 850, 'distance': None},
            {'user': marvel_users[4], 'type': 'HIIT', 'duration': 30, 'calories': 500, 'distance': None},
            # DC heroes activities
            {'user': dc_users[0], 'type': 'Running', 'duration': 120, 'calories': 1000, 'distance': 20.0},
            {'user': dc_users[0], 'type': 'Weightlifting', 'duration': 90, 'calories': 750, 'distance': None},
            {'user': dc_users[1], 'type': 'Boxing', 'duration': 90, 'calories': 900, 'distance': None},
            {'user': dc_users[1], 'type': 'HIIT', 'duration': 60, 'calories': 700, 'distance': None},
            {'user': dc_users[2], 'type': 'Weightlifting', 'duration': 75, 'calories': 650, 'distance': None},
            {'user': dc_users[2], 'type': 'Running', 'duration': 60, 'calories': 600, 'distance': 10.0},
            {'user': dc_users[3], 'type': 'Running', 'duration': 30, 'calories': 700, 'distance': 12.5},
            {'user': dc_users[3], 'type': 'HIIT', 'duration': 45, 'calories': 650, 'distance': None},
            {'user': dc_users[4], 'type': 'Swimming', 'duration': 90, 'calories': 800, 'distance': 5.0},
            {'user': dc_users[4], 'type': 'Weightlifting', 'duration': 60, 'calories': 550, 'distance': None},
        ]
        
        for activity_data in activities_data:
            Activity.objects.create(
                user_id=str(activity_data['user']._id),
                user_name=activity_data['user'].name,
                activity_type=activity_data['type'],
                duration=activity_data['duration'],
                calories_burned=activity_data['calories'],
                distance=activity_data['distance']
            )
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(activities_data)} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = []
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(a.calories_burned for a in user_activities)
            total_activities = user_activities.count()
            
            leaderboard_data.append({
                'user': user,
                'total_calories': total_calories,
                'total_activities': total_activities
            })
        
        # Sort by total calories
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        
        for rank, data in enumerate(leaderboard_data, start=1):
            Leaderboard.objects.create(
                user_id=str(data['user']._id),
                user_name=data['user'].name,
                team=data['user'].team,
                total_calories=data['total_calories'],
                total_activities=data['total_activities'],
                rank=rank
            )
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(leaderboard_data)} leaderboard entries'))
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts = [
            Workout.objects.create(
                name='Hero Strength Training',
                description='Build strength like a superhero with compound movements',
                difficulty='Hard',
                duration=60,
                category='Strength',
                recommended_for='Building muscle and power'
            ),
            Workout.objects.create(
                name='Speed Force Cardio',
                description='High-intensity cardio to boost your speed and endurance',
                difficulty='Medium',
                duration=45,
                category='Cardio',
                recommended_for='Improving cardiovascular fitness'
            ),
            Workout.objects.create(
                name='Warrior Yoga Flow',
                description='Flexibility and mindfulness for balanced heroes',
                difficulty='Easy',
                duration=30,
                category='Flexibility',
                recommended_for='Recovery and flexibility'
            ),
            Workout.objects.create(
                name='Combat Training HIIT',
                description='Intense interval training for battle readiness',
                difficulty='Hard',
                duration=30,
                category='HIIT',
                recommended_for='Fat burning and conditioning'
            ),
            Workout.objects.create(
                name='Aquatic Power Swim',
                description='Swimming workout for full-body conditioning',
                difficulty='Medium',
                duration=45,
                category='Swimming',
                recommended_for='Low-impact full-body workout'
            ),
            Workout.objects.create(
                name='Shield Bearer Endurance',
                description='Long-distance running for stamina building',
                difficulty='Medium',
                duration=60,
                category='Running',
                recommended_for='Building endurance'
            ),
        ]
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(workouts)} workout plans'))
        
        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
        self.stdout.write('='*50)
        self.stdout.write(f'Total Users: {User.objects.count()}')
        self.stdout.write(f'Total Teams: {Team.objects.count()}')
        self.stdout.write(f'Total Activities: {Activity.objects.count()}')
        self.stdout.write(f'Total Leaderboard Entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Total Workouts: {Workout.objects.count()}')
        self.stdout.write('='*50 + '\n')
