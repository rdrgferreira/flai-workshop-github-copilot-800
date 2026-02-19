from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin interface for User model"""
    list_display = ('name', 'email', 'team', 'created_at')
    list_filter = ('team', 'created_at')
    search_fields = ('name', 'email', 'team')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    """Admin interface for Team model"""
    list_display = ('name', 'description', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin interface for Activity model"""
    list_display = ('user_name', 'activity_type', 'duration', 'calories_burned', 'distance', 'date')
    list_filter = ('activity_type', 'date')
    search_fields = ('user_name', 'activity_type', 'user_id')
    ordering = ('-date',)
    readonly_fields = ('date',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    """Admin interface for Leaderboard model"""
    list_display = ('rank', 'user_name', 'team', 'total_calories', 'total_activities')
    list_filter = ('team',)
    search_fields = ('user_name', 'team', 'user_id')
    ordering = ('rank',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    """Admin interface for Workout model"""
    list_display = ('name', 'difficulty', 'duration', 'category', 'recommended_for')
    list_filter = ('difficulty', 'category')
    search_fields = ('name', 'description', 'category', 'recommended_for')
    ordering = ('name',)
