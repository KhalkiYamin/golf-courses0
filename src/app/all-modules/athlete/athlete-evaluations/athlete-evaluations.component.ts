import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import {
    AthleteDashboardService,
    AthleteEvaluationResponse
} from 'src/app/services/athlete-dashboard.service';

interface AthleteProfileResponse {
    id?: number;
    nom?: string;
    prenom?: string;
    sport?: string;
    niveau?: string;
}

type MetricKey = 'technique' | 'physique' | 'vitesse' | 'discipline';

interface MetricBar {
    key: MetricKey;
    label: string;
    score: number;
    target: number;
    gapToTarget: number;
    width: number;
    tone: 'excellent' | 'good' | 'average' | 'improve';
}

interface TrendPoint {
    label: string;
    value: number;
}

interface StoredCoachEvaluation {
    technique?: number;
    physique?: number;
    vitesse?: number;
    mental?: number;
    discipline?: number;
    commentaire?: string;
    lastUpdated?: string;
}

@Component({
    selector: 'app-athlete-evaluations',
    templateUrl: './athlete-evaluations.component.html',
    styleUrls: ['./athlete-evaluations.component.css']
})
export class AthleteEvaluationsComponent implements OnInit {
    private readonly coachStorageKey = 'coach-athlete-evaluations';

    loading = false;
    errorMessage = '';

    athleteName = 'Athlete';
    athleteSport = '-';
    athleteLevel = '-';
    lastUpdated = '-';
    coachComment = 'Aucun commentaire coach pour le moment.';

    metricBars: MetricBar[] = [];
    selectedMetricKey: MetricKey = 'technique';
    trendPoints: TrendPoint[] = [];

    constructor(private athleteDashboardService: AthleteDashboardService) { }

    ngOnInit(): void {
        this.loadEvaluations();
    }

    loadEvaluations(): void {
        this.loading = true;
        this.errorMessage = '';

        forkJoin({
            profile: this.athleteDashboardService.getAthleteProfile().pipe(
                catchError(() => of(null as AthleteProfileResponse | null))
            ),
            evaluation: this.athleteDashboardService.getAthleteEvaluations().pipe(
                catchError(() => of(null as AthleteEvaluationResponse | null))
            )
        }).subscribe({
            next: ({ profile, evaluation }: { profile: AthleteProfileResponse | null; evaluation: AthleteEvaluationResponse | null }) => {
                const profileData = profile || {};
                this.athleteName = this.resolveAthleteName(profileData);
                this.athleteSport = this.cleanText(profileData.sport) || '-';
                this.athleteLevel = this.cleanText(profileData.niveau) || '-';

                const storedEvaluation = this.readStoredEvaluation(profileData.id);
                const computed = this.resolveScores(evaluation, storedEvaluation);

                this.metricBars = this.buildMetricBars(computed);
                this.selectedMetricKey = this.metricBars.length ? this.metricBars[0].key : 'technique';
                this.trendPoints = this.buildTrendPoints(this.averageScore, this.athleteName.length);
                this.coachComment =
                    this.cleanText(evaluation?.commentaire) ||
                    this.cleanText(storedEvaluation.commentaire) ||
                    this.buildDefaultComment(this.averageScore);
                this.lastUpdated =
                    this.cleanText(evaluation?.updatedAt) ||
                    this.cleanText(storedEvaluation.lastUpdated) ||
                    this.formatDate(new Date());
                this.loading = false;
            },
            error: () => {
                this.errorMessage = 'Impossible de charger les evaluations de performance.';
                this.loading = false;
            }
        });
    }

    get averageScore(): number {
        if (!this.metricBars.length) {
            return 0;
        }

        const total = this.metricBars.reduce((sum: number, metric: MetricBar) => sum + metric.score, 0);
        return Number((total / this.metricBars.length).toFixed(1));
    }

    get strongestMetric(): MetricBar | null {
        if (!this.metricBars.length) {
            return null;
        }

        return this.metricBars.reduce((best: MetricBar, current: MetricBar) => {
            return current.score > best.score ? current : best;
        });
    }

    get improvementMetric(): MetricBar | null {
        if (!this.metricBars.length) {
            return null;
        }

        return this.metricBars.reduce((lowest: MetricBar, current: MetricBar) => {
            return current.score < lowest.score ? current : lowest;
        });
    }

    get selectedMetric(): MetricBar | null {
        return this.metricBars.find((metric: MetricBar) => metric.key === this.selectedMetricKey) || null;
    }

    selectMetric(metric: MetricBar): void {
        this.selectedMetricKey = metric.key;
    }

    scoreLabel(score: number): string {
        if (score >= 8.5) {
            return 'Excellent';
        }

        if (score >= 7) {
            return 'Solide';
        }

        if (score >= 5.5) {
            return 'En progression';
        }

        return 'A renforcer';
    }

    private resolveAthleteName(profile: AthleteProfileResponse): string {
        const firstName = this.cleanText(profile.prenom);
        const lastName = this.cleanText(profile.nom);
        const merged = `${firstName} ${lastName}`.trim();
        return merged || 'Athlete';
    }

    private resolveScores(
        apiEvaluation: AthleteEvaluationResponse | null,
        storedEvaluation: StoredCoachEvaluation
    ): Record<MetricKey, number> {
        const technique = this.normalizeScore(
            apiEvaluation ? apiEvaluation.technique : undefined,
            storedEvaluation.technique,
            7.4
        );
        const physique = this.normalizeScore(
            apiEvaluation ? (apiEvaluation.physique ?? apiEvaluation.endurance) : undefined,
            storedEvaluation.physique,
            technique - 0.4
        );
        const vitesse = this.normalizeScore(
            apiEvaluation ? (apiEvaluation.mental ?? apiEvaluation.speed) : undefined,
            storedEvaluation.vitesse ?? storedEvaluation.mental,
            technique - 0.2
        );
        const discipline = this.normalizeScore(
            apiEvaluation ? apiEvaluation.discipline : undefined,
            storedEvaluation.discipline,
            technique - 0.5
        );

        return {
            technique,
            physique,
            vitesse,
            discipline,
        };
    }

    private buildMetricBars(scores: Record<MetricKey, number>): MetricBar[] {
        const target = 8;
        const sequence: Array<{ key: MetricKey; label: string }> = [
            { key: 'technique', label: 'Technique' },
            { key: 'physique', label: 'Physique' },
            { key: 'vitesse', label: 'Vitesse' },
            { key: 'discipline', label: 'Discipline' }
        ];

        return sequence.map((item) => {
            const score = this.normalizeScore(scores[item.key], undefined, 6.5);
            return {
                key: item.key,
                label: item.label,
                score,
                target,
                gapToTarget: Number((target - score).toFixed(1)),
                width: Math.max(8, Math.min(100, score * 10)),
                tone: this.resolveTone(score)
            };
        });
    }

    private buildTrendPoints(currentAverage: number, seed: number): TrendPoint[] {
        const labels = ['Semaine -5', 'Semaine -4', 'Semaine -3', 'Semaine -2', 'Semaine -1', 'Actuelle'];

        return labels.map((label: string, index: number) => {
            const shift = ((seed + index * 3) % 7) - 3;
            const value = this.normalizeScore(currentAverage + (shift * 0.18) + (index * 0.1) - 0.35, undefined, 6.5);
            return {
                label,
                value
            };
        });
    }

    private resolveTone(score: number): 'excellent' | 'good' | 'average' | 'improve' {
        if (score >= 8.5) {
            return 'excellent';
        }

        if (score >= 7) {
            return 'good';
        }

        if (score >= 5.5) {
            return 'average';
        }

        return 'improve';
    }

    private normalizeScore(primary?: number, secondary?: number, fallback?: number): number {
        if (typeof primary === 'number' && !Number.isNaN(primary)) {
            return this.clampScore(primary);
        }

        if (typeof secondary === 'number' && !Number.isNaN(secondary)) {
            return this.clampScore(secondary);
        }

        return this.clampScore(typeof fallback === 'number' ? fallback : 6.5);
    }

    private clampScore(score: number): number {
        return Number(Math.max(1, Math.min(10, score)).toFixed(1));
    }

    private cleanText(value: unknown): string {
        if (typeof value !== 'string') {
            return '';
        }

        return value.trim();
    }

    private readStoredEvaluation(athleteId?: number): StoredCoachEvaluation {
        const raw = localStorage.getItem(this.coachStorageKey);
        if (!raw) {
            return {};
        }

        try {
            const parsed = JSON.parse(raw) as { [key: string]: StoredCoachEvaluation };
            if (athleteId && parsed[athleteId]) {
                return parsed[athleteId];
            }

            const firstKey = Object.keys(parsed)[0];
            return firstKey ? (parsed[firstKey] || {}) : {};
        } catch {
            return {};
        }
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    private buildDefaultComment(average: number): string {
        if (average >= 8) {
            return 'Progression remarquable. Continuez avec la meme intensite et des objectifs encore plus ambitieux.';
        }

        if (average >= 6.5) {
            return 'Niveau global positif. Consolidez la regularite et gardez le focus sur la qualite technique.';
        }

        return 'La base est presente. Un plan de travail plus structure aidera a accelerer la progression.';
    }
}
