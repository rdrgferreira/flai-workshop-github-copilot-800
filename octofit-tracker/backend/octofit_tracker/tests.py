from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com",
            password="testpass123"
        )
    
    def test_user_creation(self):
        """Test user is created correctly"""
        self.assertEqual(self.user.name, "Test User")
        self.assertEqual(self.user.email, "test@example.com")
    
    def test_user_str(self):
        """Test user string representation"""
        self.assertEqual(str(self.user), "Test User")


class TeamModelTest(TestCase):
    """Test cases for Team model"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="A test team"
        )
    
    def test_team_creation(self):
        """Test team is created correctly"""
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "A test team")
    
    def test_team_str(self):
        """Test team string representation"""
        self.assertEqual(str(self.team), "Test Team")


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="123",
            user_name="Test User",
            activity_type="Running",
            duration=30,
            calories_burned=300,
            distance=5.0
        )
    
    def test_activity_creation(self):
        """Test activity is created correctly"""
        self.assertEqual(self.activity.user_name, "Test User")
        self.assertEqual(self.activity.activity_type, "Running")
        self.assertEqual(self.activity.duration, 30)
    
    def test_activity_str(self):
        """Test activity string representation"""
        self.assertEqual(str(self.activity), "Test User - Running")


class LeaderboardModelTest(TestCase):
    """Test cases for Leaderboard model"""
    
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user_id="123",
            user_name="Test User",
            team="Test Team",
            total_calories=1000,
            total_activities=5,
            rank=1
        )
    
    def test_leaderboard_creation(self):
        """Test leaderboard entry is created correctly"""
        self.assertEqual(self.entry.user_name, "Test User")
        self.assertEqual(self.entry.total_calories, 1000)
        self.assertEqual(self.entry.rank, 1)
    
    def test_leaderboard_str(self):
        """Test leaderboard string representation"""
        self.assertEqual(str(self.entry), "1. Test User - 1000 calories")


class WorkoutModelTest(TestCase):
    """Test cases for Workout model"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name="Morning Run",
            description="A refreshing morning run",
            difficulty="Medium",
            duration=30,
            category="Cardio"
        )
    
    def test_workout_creation(self):
        """Test workout is created correctly"""
        self.assertEqual(self.workout.name, "Morning Run")
        self.assertEqual(self.workout.difficulty, "Medium")
        self.assertEqual(self.workout.duration, 30)
    
    def test_workout_str(self):
        """Test workout string representation"""
        self.assertEqual(str(self.workout), "Morning Run")


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""
    
    def test_create_user(self):
        """Test creating a user via API"""
        url = '/api/users/'
        data = {
            'name': 'API User',
            'email': 'api@example.com',
            'password': 'apipass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_users(self):
        """Test listing users via API"""
        url = '/api/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITest(APITestCase):
    """Test cases for Team API endpoints"""
    
    def test_create_team(self):
        """Test creating a team via API"""
        url = '/api/teams/'
        data = {
            'name': 'API Team',
            'description': 'Team created via API'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_teams(self):
        """Test listing teams via API"""
        url = '/api/teams/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    """Test cases for Activity API endpoints"""
    
    def test_create_activity(self):
        """Test creating an activity via API"""
        url = '/api/activities/'
        data = {
            'user_id': '123',
            'user_name': 'Test User',
            'activity_type': 'Running',
            'duration': 30,
            'calories_burned': 300,
            'distance': 5.0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_activities(self):
        """Test listing activities via API"""
        url = '/api/activities/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    """Test cases for Leaderboard API endpoints"""
    
    def test_create_leaderboard_entry(self):
        """Test creating a leaderboard entry via API"""
        url = '/api/leaderboard/'
        data = {
            'user_id': '123',
            'user_name': 'Test User',
            'team': 'Test Team',
            'total_calories': 1000,
            'total_activities': 5,
            'rank': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_leaderboard(self):
        """Test listing leaderboard via API"""
        url = '/api/leaderboard/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    """Test cases for Workout API endpoints"""
    
    def test_create_workout(self):
        """Test creating a workout via API"""
        url = '/api/workouts/'
        data = {
            'name': 'Morning Run',
            'description': 'A refreshing morning run',
            'difficulty': 'Medium',
            'duration': 30,
            'category': 'Cardio'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_workouts(self):
        """Test listing workouts via API"""
        url = '/api/workouts/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
